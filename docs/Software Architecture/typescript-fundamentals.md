---
sidebar_position: 1
title: Dasar-Dasar TypeScript
---

# Dasar-Dasar TypeScript

**Pengenalan TypeScript dan konsep-konsep dasarnya.**

TypeScript adalah superset dari JavaScript yang menambahkan _static typing_. Berbeda dari JavaScript yang bersifat dinamis, TypeScript mengharuskan deklarasi tipe secara eksplisit — membuat kode lebih aman dan mudah dipelihara.

---

## Persiapan Proyek

Instal dependensi yang dibutuhkan:

```bash npm2yarn
npm init -y
npm install typescript
npm install -D @types/node
npm install -D ts-node
```

Konfigurasi script di `package.json`:

```json
{
  "scripts": {
    "start": "ts-node src/main.ts"
  }
}
```

### Struktur File Proyek

| File                | Kegunaan                                                     |
| ------------------- | ------------------------------------------------------------ |
| `package.json`      | File root proyek, berisi dependensi dan script               |
| `package-lock.json` | Mengunci versi dependensi agar tetap konsisten               |
| `node_modules/`     | Folder tempat dependensi disimpan                            |
| `tsconfig.json`     | Konfigurasi compiler TypeScript                              |

---

## Variabel

TypeScript mendukung tiga cara mendeklarasikan variabel, masing-masing dengan lingkup (_scope_) yang berbeda.

```typescript
// Sintaks: let/var/const <nama> : <tipe> = <nilai>

let str = "hello world"; // inferensi tipe (otomatis string)
var str2: string = "hello world"; // tipe eksplisit
const PI = 3.14; // konstanta, tidak bisa diubah nilainya
```

### let vs var vs const

| Keyword | Lingkup        | Bisa Diubah? |
| ------- | -------------- | ------------ |
| `let`   | Block scope    | Ya           |
| `var`   | Function scope | Ya           |
| `const` | Block scope    | Tidak        |

```typescript
// let -> hanya bisa diakses di dalam blok {}
function contohLet() {
  if (true) {
    let blockVar = "Saya di dalam blok";
    console.log(blockVar); // ✅ OK
  }
  // console.log(blockVar); // ❌ Error: tidak bisa diakses di luar blok
}

// var -> bisa diakses di seluruh fungsi
function contohVar() {
  if (true) {
    var funcVar = "Saya di dalam blok";
    console.log(funcVar); // ✅ OK
  }
  console.log(funcVar); // ✅ OK (masih bisa diakses)
}
```

---

## Tipe Data

### Tipe Dasar

Tipe yang paling sering digunakan:

```typescript
let name1: string = "Devon"; // teks
let age: number = 19; // angka
let isStudent: boolean = true; // true/false
let hobbies: string[] = ["Gaming", "Sleeping"]; // array of string
let address: [string, number] = ["Jl. Merdeka", 123]; // tuple
```

#### Enum

Kumpulan konstanta bernama. Berguna untuk merepresentasikan sekumpulan pilihan yang tetap:

```typescript
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue",
}

let favoriteColor: Color = Color.Green;
console.log(favoriteColor); // "green"
```

> **Catatan:** Secara default, nilai enum dimulai dari indeks `0`. Kamu bisa menggantinya dengan nilai kustom seperti contoh di atas.

### Tipe Lanjutan

Tipe yang lebih fleksibel untuk kasus-kasus tertentu:

```typescript
// Union — bisa berupa string ATAU number
const v: string | number = "bisa string atau number";

// Any — bisa apa saja (hindari jika memungkinkan)
const z: any = "bisa apa saja";

// Unknown — mirip any, tapi lebih aman karena TypeScript
// memaksamu untuk memeriksa tipe sebelum menggunakannya
let u: unknown = 5;

// Void — untuk fungsi yang tidak mengembalikan nilai
function print(): void {
  console.log("Fungsi ini tidak mengembalikan nilai");
}
```

| Tipe      | Deskripsi                     | Kapan Digunakan                          |
| --------- | ----------------------------- | ---------------------------------------- |
| `string`  | Teks                          | Nama, alamat, pesan                      |
| `number`  | Integer & float               | Umur, harga, kalkulasi                   |
| `boolean` | true / false                  | Status, flag                             |
| `array`   | Kumpulan nilai                | Daftar data                              |
| `tuple`   | Array dengan tipe tetap       | Koordinat, pasangan key-value            |
| `enum`    | Konstanta bernama             | Hari, status, kategori                   |
| `union`   | Beberapa kemungkinan tipe     | Input yang fleksibel                     |
| `any`     | Tanpa batasan tipe            | Migrasi dari JS (hindari penggunaan)     |
| `unknown` | Bebas tapi aman               | Data eksternal / respons API             |
| `void`    | Tidak ada nilai kembalian     | Fungsi tanpa return                      |

---

## Interface

Interface mendefinisikan "bentuk" dari sebuah objek — seperti blueprint atau kontrak.

```typescript
interface Person {
  name: string;
  age?: number; // ? berarti opsional
  greet(): void;
}

const user: Person = {
  name: "Devon",
  age: 20,
  greet() {
    console.log(`Halo nama saya ${this.name}`);
  },
};

user.greet(); // "Halo nama saya Devon"
```

> **Tips:** Gunakan interface untuk mendefinisikan struktur data yang dipakai ulang di banyak tempat dalam kode.

---

## Alur Kontrol

### If-Else

```typescript
let score: number = 85;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else {
  console.log("C");
}
// Output: "B"
```

### Switch Case

Gunakan `switch` saat memeriksa banyak kondisi terhadap nilai yang sama:

```typescript
enum HariDalamSeminggu {
  Senin = 1,
  Selasa,
  Rabu,
  Kamis,
  Jumat,
  Sabtu,
  Minggu,
}

let hari: number = HariDalamSeminggu.Sabtu;

switch (hari) {
  case HariDalamSeminggu.Senin:
  case HariDalamSeminggu.Selasa:
  case HariDalamSeminggu.Rabu:
  case HariDalamSeminggu.Kamis:
  case HariDalamSeminggu.Jumat:
    console.log("Hari Kerja");
    break;
  case HariDalamSeminggu.Sabtu:
  case HariDalamSeminggu.Minggu:
    console.log("Akhir Pekan");
    break;
  default:
    console.log("Hari tidak valid");
}
// Output: "Akhir Pekan"
```

### Operator Ternary

Singkatan dari ekspresi if-else sederhana:

```typescript
let age: number = 18;
let bisaMemilih: string = age >= 18 ? "Ya" : "Tidak";
console.log(`Bisa memilih: ${bisaMemilih}`); // "Bisa memilih: Ya"
```

---

## Perulangan

### For Loop

Perulangan klasik dengan penghitung:

```typescript
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
```

### For...of

Iterasi berdasarkan **nilai** dari sebuah array:

```typescript
let buah: string[] = ["apel", "pisang", "jeruk"];

for (let item of buah) {
  console.log(item); // "apel", "pisang", "jeruk"
}
```

### For...in

Iterasi berdasarkan **indeks / kunci** dari array atau objek:

```typescript
for (let i in buah) {
  console.log(i, buah[i]); // "0 apel", "1 pisang", "2 jeruk"
}
```

> **`for...of` vs `for...in`:**
>
> - `for...of` → memberikan **nilai** secara langsung
> - `for...in` → memberikan **indeks / kunci**

### While Loop

```typescript
let count: number = 0;

while (count < 5) {
  console.log(count); // 0, 1, 2, 3, 4
  count++;
}
```

### Do...While

Seperti `while`, tapi **selalu dieksekusi setidaknya sekali** sebelum memeriksa kondisi:

```typescript
let n = 3;

do {
  console.log(n); // 3, 2, 1
  n--;
} while (n > 0);
```

### Break

```typescript
// break -> menghentikan perulangan sepenuhnya
for (let i = 0; i < 5; i++) {
  if (i === 1) {
    break; // berhenti saat i = 1
  }
  console.log(i); // hanya mencetak: 0
}
```

---

## Fungsi

### Fungsi Dasar

```typescript
// Tanpa parameter, tanpa nilai kembalian
function sapa(): void {
  console.log("Halo");
}
sapa();
```

### Fungsi dengan Parameter dan Nilai Kembalian

```typescript
function hitung(panjang: number, lebar: number): number {
  return panjang * lebar;
}

hitung(3, 4); // mengembalikan 12
```

### Parameter Opsional

Tambahkan `?` untuk membuat parameter bersifat opsional:

```typescript
function buatUser(nama: string, umur: number, email?: string): object {
  return {
    nama,
    umur,
    email: email ?? "Email tidak tersedia",
  };
}

buatUser("Devon", 20); // email tidak diberikan
buatUser("Devon", 20, "d@x.com"); // email diberikan
```

### Parameter Default

Nilai default digunakan saat parameter tidak diisi:

```typescript
function sapaPengguna(nama: string, salam: string = "Halo"): string {
  return `${salam}, ${nama}`;
}

sapaPengguna("Devon"); // "Halo, Devon"
sapaPengguna("Devon", "Hai"); // "Hai, Devon"
```

### Function Expression & Arrow Function

```typescript
// Function Expression
const kali = function (x: number, y: number): number {
  return x * y;
};

// Arrow Function (lebih ringkas)
const bagi = (x: number, y: number): number => {
  return x / y;
};

kali(3, 4); // 12
bagi(8, 2); // 4
```

---

## Method Array

Fungsi bawaan array yang sering dipakai bersama arrow function:

```typescript
let angka: number[] = [1, 2, 3, 4, 5];

// map → membuat array baru dengan mentransformasi setiap elemen
let dikali2 = angka.map((num) => num * 2);
console.log(dikali2); // [2, 4, 6, 8, 10]

// filter → membuat array baru dengan elemen yang lolos kondisi
let genap = angka.filter((num) => num % 2 === 0);
console.log(genap); // [2, 4]

// reduce → memproses seluruh array menjadi satu nilai
let total = angka.reduce((acc, curr) => acc + curr, 0);
console.log(total); // 15

// forEach → menjalankan fungsi untuk setiap elemen (tanpa nilai kembalian)
angka.forEach((num) => console.log(num));
```

| Method      | Mengembalikan | Tujuan                                  |
| ----------- | ------------- | --------------------------------------- |
| `map()`     | Array baru    | Mentransformasi setiap elemen           |
| `filter()`  | Array baru    | Memfilter elemen berdasarkan kondisi    |
| `reduce()`  | Satu nilai    | Mengakumulasi semua elemen              |
| `forEach()` | `void`        | Menjalankan efek samping per elemen     |

---

## Ringkasan

```
Dasar-Dasar TypeScript
│
├── Variabel ─────── let (block) / var (function) / const (immutable)
├── Tipe Data
│   ├── Dasar ───── string, number, boolean, array, tuple, enum
│   └── Lanjutan ── union, any, unknown, void
├── Interface ────── Blueprint / kontrak untuk bentuk objek
├── Alur Kontrol ─── if-else, switch, ternary
├── Perulangan ───── for, for-of, for-in, while, do-while
└── Fungsi ───────── biasa, param opsional, param default, arrow
```
