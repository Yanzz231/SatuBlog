import React, { useState, useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useColorMode } from "@docusaurus/theme-common";
import styles from "./styles.module.css";

// ── Global Pyodide singleton ──────────────────────────────────────────────────
let _pyodidePromise: Promise<any> | null = null;
const _loadedPkgs = new Set<string>();
let _execLock = false;

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

async function _injectScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("Gagal memuat script: " + src));
    document.head.appendChild(el);
  });
}

async function _getPyodide(pkgs: string[], onMsg: (m: string) => void) {
  if (!_pyodidePromise) {
    onMsg("Memuat Python runtime…");
    _pyodidePromise = (async () => {
      await _injectScript(PYODIDE_CDN + "pyodide.js");
      return (window as any).loadPyodide({ indexURL: PYODIDE_CDN });
    })();
  }
  const py = await _pyodidePromise;
  const missing = pkgs.filter((p) => !_loadedPkgs.has(p));
  if (missing.length > 0) {
    onMsg(`Menginstal paket: ${missing.join(", ")}…`);
    await py.loadPackage(missing);
    missing.forEach((p) => _loadedPkgs.add(p));
  }
  return py;
}

// ── Component ─────────────────────────────────────────────────────────────────
type Status = "idle" | "busy" | "done" | "error";

interface RunCodeProps {
  children: string | string[];
  preamble?: string;
  packages?: string[];
  lang?: string;
  title?: string;
}

export default function RunCode({
  children,
  preamble = "",
  packages = [],
  lang = "python",
  title,
}: RunCodeProps) {
  const raw = Array.isArray(children) ? children.join("") : String(children ?? "");
  const initialCode = raw.trim();

  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const [output, setOutput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const { colorMode } = useColorMode();
  const prismTheme = colorMode === "dark" ? themes.vsDark : themes.vsLight;

  const taRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = code.substring(0, start) + "    " + code.substring(end);
      setCode(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
  }

  async function run() {
    if (_execLock) {
      setErrMsg("Kode lain sedang berjalan. Tunggu sebentar.");
      setStatus("error");
      return;
    }
    _execLock = true;
    setStatus("busy");
    setOutput("");
    setImages([]);
    setErrMsg("");

    const fullCode = preamble ? preamble + "\n" + code : code;

    let py: any = null;
    try {
      py = await _getPyodide(packages, setMsg);
      setMsg("Menjalankan…");

      py.runPython(
        "import sys, io as _io\n_run_buf = _io.StringIO()\n_orig_stdout = sys.stdout\nsys.stdout = _run_buf"
      );
      py.runPython(`try:
    import matplotlib; matplotlib.use('agg')
    import matplotlib.pyplot as plt
    plt.show = lambda *a, **k: None
except Exception:
    pass`);

      await py.runPythonAsync(fullCode);
      py.runPython("sys.stdout = _orig_stdout");

      const text: string = py.runPython("_run_buf.getvalue()");
      const figsJson: string = py.runPython(`import json, io as _io2, base64 as _b64
_figs = []
try:
    import matplotlib.pyplot as _plt
    for _n in _plt.get_fignums():
        _fig = _plt.figure(_n)
        _buf2 = _io2.BytesIO()
        _fig.savefig(_buf2, format='png', bbox_inches='tight', dpi=96)
        _buf2.seek(0)
        _figs.append('data:image/png;base64,' + _b64.b64encode(_buf2.read()).decode())
    _plt.close('all')
except Exception:
    pass
json.dumps(_figs)`);

      setOutput(text.trimEnd());
      setImages(JSON.parse(figsJson));
      setStatus("done");
    } catch (e: any) {
      if (py) {
        try { py.runPython("import sys; sys.stdout = sys.__stdout__"); } catch {}
      }
      setErrMsg(String(e?.message ?? e));
      setStatus("error");
    } finally {
      _execLock = false;
    }
  }

  const busy = status === "busy";
  const shown = status === "done" || status === "error";

  return (
    <div className={styles.wrap}>
      <div className={styles.editorWrap}>
        {title && <div className={styles.editorTitle}>{title}</div>}
        <div
          className={styles.editorContainer}
          style={{ background: prismTheme.plain.backgroundColor }}
        >
          {/* Mirror div — drives container height, invisible */}
          <div className={styles.mirror} aria-hidden="true">
            {code + "\n"}
          </div>

          {/* Highlighted code layer (background) */}
          <Highlight code={code} language={lang as any} theme={prismTheme}>
            {({ tokens, getLineProps, getTokenProps }) => (
              <div className={styles.highlightLayer} aria-hidden="true">
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, j) => (
                      <span key={j} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Highlight>

          {/* Editable textarea (foreground, transparent text) */}
          <textarea
            ref={taRef}
            className={styles.textareaOverlay}
            style={{ caretColor: prismTheme.plain.color }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      <div className={styles.toolbar}>
        {busy && <span className={styles.statusMsg}>{msg}</span>}
        <button className={styles.copyBtn} onClick={copyCode} title="Salin kode">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <button className={styles.runBtn} onClick={run} disabled={busy} title="Jalankan kode">
          {busy ? <span className={styles.spin} /> : <PlayIcon />}
          {busy ? "Berjalan…" : "Jalankan"}
        </button>
      </div>

      {shown && (
        <div className={`${styles.result} ${status === "error" ? styles.errBox : ""}`}>
          <span className={styles.rlabel}>{status === "error" ? "Error" : "Output"}</span>
          {status === "error" ? (
            <pre className={`${styles.pre} ${styles.errPre}`}>{errMsg}</pre>
          ) : (
            <>
              {output && <pre className={styles.pre}>{output}</pre>}
              {images.map((src, i) => (
                <img key={i} src={src} className={styles.img} alt={`plot-${i + 1}`} />
              ))}
              {!output && images.length === 0 && (
                <span className={styles.empty}>tidak ada output</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M2 1.5 8 5 2 8.5V1.5z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
