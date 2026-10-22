# Backend API Guidelines & Contracts

## Pengantar

Folder ini berisi spesifikasi teknis dan kontrak API yang disusun untuk menjembatani kebutuhan fitur Front-End dengan implementasi Back-End. Dokumen ini dibuat otomatis atau manual sebagai acuan utama bagi tim Backend dalam mengembangkan layanan.

## Technology Stack Standar

Kecuali disebutkan lain dalam dokumen spesifik fitur, standar teknologi yang digunakan adalah:

-   **Language**: Go (Golang) versi terbaru.
-   **Framework**: Gin / Echo / Fiber (Sesuai kesepakatan tim).
-   **Database**: PostgreSQL / MySQL.
-   **Architecture**: Clean Architecture / Layered Architecture.

## Struktur Dokumentasi Per Fitur

Setiap fitur atau layanan (misal: `register`, `login`, `transaction`) akan memiliki folder tersendiri di dalam direktori ini. Di dalam setiap folder fitur, **wajib** terdapat 3 dokumen berikut:

### 1. `api-contract.md`
Dokumen ini berfungsi sebagai kesepakatan antarmuka (interface) antara FE dan BE.
*   **Endpoint URL**: Path lengkap (misal: `/api/v1/auth/login`).
*   **HTTP Method**: GET, POST, PUT, DELETE, PATCH.
*   **Request Headers**: Token, Content-Type, dll.
*   **Request Payload**: Struktur JSON input beserta tipe data dan validasi (required/optional).
*   **Response Body**: Struktur JSON output untuk skenario Sukses (200) dan Error (400, 401, 500).

### 2. `technical.md` (Golang Implementation)
Panduan teknis untuk implementasi kode di sisi Golang.
*   **Package Structure**: Saran penamaan package dan lokasi file.
*   **Business Logic**: Flowchart atau pseudocode logika bisnis.
*   **Validation Rules**: Detail aturan validasi (misal: email unique, password complexity).
*   **Libraries**: Library khusus yang dibutuhkan (misal: `jwt-go`, `bcrypt`, `uuid`).

### 3. `database.md`
Spesifikasi lapisan data.
*   **ER Diagram**: Hubungan antar tabel.
*   **Schema**: Definisi tabel, tipe data kolom, primary key, dan foreign key.
*   **Migrations**: Script atau langkah migrasi database.
*   **Data Models**: Representasi struct Go untuk model database (Gorm/Sqlx).

---

## Contoh Struktur Folder

```text
guidelines/api/
├── README.md           # File ini
├── _template/          # Template kosong untuk copy-paste
│   ├── api-contract.md
│   ├── technical.md
│   └── database.md
├── auth/               # Contoh Fitur Otentikasi
│   ├── api-contract.md
│   ├── technical.md
│   └── database.md
└── products/           # Contoh Fitur Produk
    ├── api-contract.md
    ├── technical.md
    └── database.md
```
