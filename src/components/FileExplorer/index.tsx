import React, { useState } from "react";
import CodeBlock from "@theme/CodeBlock";
import { File, Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";
import styles from "./styles.module.css";

export type FileNode = {
  type: "file" | "folder";
  name: string;
  lang?: string;
  code?: string;
  children?: FileNode[];
};

function flattenFiles(nodes: FileNode[], prefix = ""): Map<string, FileNode> {
  const map = new Map<string, FileNode>();
  for (const node of nodes) {
    const path = prefix ? `${prefix}/${node.name}` : node.name;
    if (node.type === "file") {
      map.set(path, node);
    } else if (node.children) {
      for (const [k, v] of flattenFiles(node.children, path)) {
        map.set(k, v);
      }
    }
  }
  return map;
}

function firstFile(nodes: FileNode[], prefix = ""): string | null {
  for (const node of nodes) {
    const path = prefix ? `${prefix}/${node.name}` : node.name;
    if (node.type === "file") return path;
    if (node.children) {
      const found = firstFile(node.children, path);
      if (found) return found;
    }
  }
  return null;
}

function TreeNode({
  node,
  depth,
  selectedPath,
  onSelect,
  pathPrefix,
}: {
  node: FileNode;
  depth: number;
  selectedPath: string;
  onSelect: (path: string) => void;
  pathPrefix: string;
}) {
  const path = pathPrefix ? `${pathPrefix}/${node.name}` : node.name;
  const [open, setOpen] = useState(true);
  const isSelected = selectedPath === path;

  if (node.type === "folder") {
    return (
      <div>
        <div
          className={styles.row}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          onClick={() => setOpen((o) => !o)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
        >
          <span className={styles.icon}>
            {open ? <FolderOpen size={13} /> : <Folder size={13} />}
          </span>
          <span className={styles.name}>{node.name}</span>
          <span className={styles.chevron}>
            {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          </span>
        </div>
        {open &&
          node.children?.map((child) => (
            <TreeNode
              key={child.name}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              pathPrefix={path}
            />
          ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles.row} ${isSelected ? styles.selected : ""}`}
      style={{ paddingLeft: `${depth * 14 + 10}px` }}
      onClick={() => onSelect(path)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(path)}
    >
      <span className={styles.icon}>
        <File size={13} />
      </span>
      <span className={styles.name}>{node.name}</span>
    </div>
  );
}

interface FileExplorerProps {
  files: FileNode[];
  defaultFile?: string;
  height?: number;
}

export default function FileExplorer({
  files,
  defaultFile,
  height = 380,
}: FileExplorerProps) {
  const fileMap = flattenFiles(files);
  const initialPath = defaultFile ?? firstFile(files) ?? "";
  const [selectedPath, setSelectedPath] = useState(initialPath);
  const selectedNode = fileMap.get(selectedPath);

  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.tree}>
        <div className={styles.treeHeader}>Explorer</div>
        <div className={styles.treeBody}>
          {files.map((node) => (
            <TreeNode
              key={node.name}
              node={node}
              depth={0}
              selectedPath={selectedPath}
              onSelect={setSelectedPath}
              pathPrefix=""
            />
          ))}
        </div>
      </div>
      <div className={styles.preview}>
        {selectedNode ? (
          <CodeBlock
            language={selectedNode.lang ?? "typescript"}
            title={selectedPath}
          >
            {selectedNode.code ?? ""}
          </CodeBlock>
        ) : (
          <div className={styles.empty}>Select a file to view its code</div>
        )}
      </div>
    </div>
  );
}
