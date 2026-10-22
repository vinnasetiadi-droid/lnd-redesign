# 📚 Tutorial: Membuat Spesifikasi Fitur Backend (UI-Driven Design)

## 🎯 Filosofi & Pengantar

Dokumen ini adalah panduan komprehensif bagi Backend Engineer untuk menyusun dokumen spesifikasi fitur di dalam folder `guidelines/api/`.

Pendekatan yang kita gunakan adalah **UI-Driven Design** atau **Frontend First**.
**Mengapa?**
1.  **Presisi**: Backend dibangun persis untuk melayani apa yang dibutuhkan User Interface.
2.  **Efisiensi**: Mencegah *Over-Fetching* (mengirim data yang tidak dipakai UI) atau *Under-Fetching* (data kurang sehingga FE harus request berkali-kali).
3.  **Sinkronisasi**: "Contract First" memungkinkan tim Frontend bekerja menggunakan Mock Server sementara Backend sedang development.

---

## 🛠️ Langkah-Langkah Detail

### 1️⃣ Tahap 1: Analisis Halaman (Deep Dive UI)

Jangan hanya melihat sekilas. Buka desain Figma atau halaman `.tsx` yang sudah ada, lalu bedah per komponen.

#### A. Analisis Form (Input)
Jika halaman memiliki Form, identifikasi:
*   **Field Wajib vs Opsional**: Mana yang ada tanda bintang (*)? Ini menentukan validasi `required`.
*   **Tipe Input**:
    *   Dropdown/Select -> Butuh API endpoint terpisah untuk mengambil list opsinya? (misal: `GET /api/categories`).
    *   File Upload -> Butuh endpoint upload terpisah atau `multipart/form-data`?
    *   Date Picker -> Tentukan format tanggal standar (`YYYY-MM-DD` atau ISO8601).
*   **Hidden Fields**: Data apa yang tidak diinput user tapi butuh dikirim? (Misal: `product_id` saat edit, atau token auth).

#### B. Analisis List/Table (Output)
Jika halaman menampilkan Tabel atau List:
*   **Kolom Data**: Catat persis data apa yang tampil.
    *   *Contoh*: UI menampilkan "Dibuat 2 jam lalu". Backend sebaiknya mengirim `created_at` (ISO Timestamp) agar Frontend yang memformatnya menjadi "time ago".
*   **Pagination**: Apakah ada tombol "Next/Prev" atau "Load More"? Jika ya, API butuh parameter `page` & `limit`.
*   **Sorting**: Apakah header tabel bisa diklik untuk urut abjad? API butuh parameter `sort_by` & `order`.
*   **Filtering**: Apakah ada kolom pencarian atau filter status? API butuh parameter `search` atau `status`.

#### C. Analisis State & Akses
*   **Loading State**: Apakah data berat? Perlukah pagination?
*   **Empty State**: Apa yang terjadi jika data kosong?
*   **Role**: Siapa yang bisa melihat halaman ini? (Admin, User biasa, atau Publik?).

---

### 2️⃣ Tahap 2: Menyusun `api-contract.md`

Ini adalah **Dokumen Paling Kritis**. Dokumen ini menjadi hukum antara FE dan BE.

**Struktur Wajib:**
1.  **Endpoint**: Gunakan kata benda jamak, RESTful. (Benar: `/users`, Salah: `/getUsers`).
2.  **Method**: GET, POST, PUT, DELETE, PATCH.
3.  **Headers**: Selalu cantumkan `Authorization: Bearer ...` jika private.
4.  **Query Params**: Dokumentasikan `?page=`, `?limit=`, dll untuk endpoint GET list.
5.  **Request Body**:
    *   Tulis dalam format JSON.
    *   Berikan contoh data nyata, bukan "string" atau "int".
    *   Tandai field mana yang `(required)` dan mana yang `(optional)`.
6.  **Response Body**:
    *   **WAJIB** mengikuti *Envelope Pattern* (`meta`, `data`).
    *   Sediakan contoh untuk skenario **200 OK** (Sukses).
    *   Sediakan contoh untuk skenario **400 Bad Request** (Validasi Gagal) dan **401 Unauthorized**.

---

### 3️⃣ Tahap 3: Merancang Database (`database.md`)

Rancang skema database untuk mendukung Kontrak API di atas.

**Poin Pengecekan:**
1.  **Kesesuaian Tipe Data**:
    *   Uang/Harga -> Gunakan `DECIMAL` atau `BIGINT` (simpan perak/sen), JANGAN `FLOAT/DOUBLE` (masalah presisi).
    *   Status -> Gunakan `ENUM` atau `VARCHAR` dengan constraint check.
    *   Tanggal -> `TIMESTAMPTZ` (PostgreSQL) agar aman zona waktu.
2.  **Audit Trails**: Selalu sertakan `created_at`, `updated_at`, dan `deleted_at` (untuk Soft Delete).
3.  **Indexing**:
    *   Lihat kembali Tahap 1B (Sorting & Filtering).
    *   Jika UI sering filter by `status` dan search by `email`, buat index pada kolom tersebut agar query cepat.
4.  **Relationships**: Tentukan Foreign Key (FK). Apakah `CASCADE` delete atau `SET NULL`?

---

### 4️⃣ Tahap 4: Implementasi Teknis (`technical.md`)

Panduan untuk coding di Golang. Petakan logika ke Clean Architecture.

**Isi Dokumen:**
1.  **Layering Strategy**:
    *   **Handler**: Validasi input (DTO), panggil UseCase, format response.
    *   **UseCase**: Logika bisnis utama (misal: hitung diskon, cek stok).
    *   **Repository**: Query SQL murni (GORM).
2.  **Validation Rules**: Detailkan aturan bisnis.
    *   *Uniqueness*: "Email tidak boleh kembar".
    *   *Logic*: "Saldo tidak boleh kurang dari 0".
3.  **Transaction Management**: Jika satu request mengubah 2 tabel (misal: `orders` dan `order_items`), tegaskan penggunaan Database Transaction (`tx.Begin()`, `tx.Commit()`, `tx.Rollback()`).
4.  **Dependency**: Sebutkan jika butuh library khusus (misal: `xendit-go` untuk payment atau `gomail` untuk email).

---

## 💡 Studi Kasus Lengkap: Fitur "Checkout Pesanan"

Anda diminta membuat backend untuk halaman Checkout.

### 1. Analisis UI
*   User memilih Alamat Pengiriman (Dropdown).
*   User memilih Kurir (Dropdown).
*   User melihat Ringkasan Belanja (Total Harga, Ongkir).
*   Tombol "Bayar Sekarang".

### 2. Output: `api-contract.md` (Snippet)
```markdown
### POST /api/orders
**Desc**: Membuat pesanan baru dari keranjang belanja.

**Body**:
{
  "address_id": "addr_123" (required),
  "courier_code": "jne" (required),
  "payment_method": "bank_transfer" (required)
}

**Response 201 Created**:
{
  "meta": { "code": 201, "status": "success" },
  "data": {
    "order_id": "ord_999",
    "total_amount": 150000,
    "payment_code": "88889999",
    "status": "pending_payment"
  }
}
```

### 3. Output: `database.md` (Snippet)
```markdown
**Table: orders**
- id (PK, UUID)
- user_id (FK, Index) -> Untuk list history pesanan cepat
- address_json (JSONB) -> Snapshot alamat saat transaksi (antisipasi user ubah alamat master)
- total_amount (BIGINT)
- status (VARCHAR: pending, paid, sent)
- created_at, updated_at
```

### 4. Output: `technical.md` (Snippet)
```markdown
**Flow Logic (UseCase):**
1. Get Cart items by User ID. If empty -> Error.
2. Calculate Total (Item Price + Ongkir logic).
3. **START DB TRANSACTION**:
    a. Create Order record.
    b. Move Cart Items to Order Items table.
    c. Delete Cart Items.
    d. Deduct Product Stock.
    e. If Stock < 0 -> **ROLLBACK** & Error.
4. **COMMIT TRANSACTION**.
5. Call Payment Gateway API to get Virtual Account.
6. Return response.
```
