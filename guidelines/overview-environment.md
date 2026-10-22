# Overview: Security & Environment

Dokumen ini menjelaskan standar manajemen variabel lingkungan (_environment variables_) dan praktik keamanan API untuk proyek ini. Mengingat kita menggunakan ekosistem **Vite**, terdapat beberapa perbedaan sintaksis dibandingkan framework lain (seperti Next.js), namun prinsip keamanannya tetap sama.

## 🌍 Environment Variables

Dalam Vite, variabel lingkungan digunakan untuk membedakan konfigurasi antara mode pengembangan (_development_), pengujian (_staging_), dan produksi (_production_).

### 1. Penamaan dan Akses (Client-Side)

Secara default, variabel lingkungan yang ada di sisi server (Node.js) tidak diekspos ke klien untuk alasan keamanan.

- **Prefix Wajib**: Agar variabel dapat diakses di dalam kode React (browser), nama variabel **wajib** diawali dengan `VITE_`.
  - ✅ Benar: `VITE_API_URL=https://api.example.com`
  - ❌ Salah: `API_KEY=secret` (tidak akan terbaca oleh Vite di browser)
- **Akses**: Gunakan objek `import.meta.env` untuk mengakses variabel.
  - Contoh: `console.log(import.meta.env.VITE_API_URL)`

> **PENTING:** Jangan pernah menaruh _secret keys_ (seperti Database Password atau Stripe Secret Key) di dalam variabel yang berawalan `VITE_`, karena variabel ini akan di-bundle ke dalam file JavaScript dan **dapat dilihat oleh siapa saja** melalui "Inspect Element".

### 2. Manajemen File .env

Kita menggunakan strategi file berjenjang untuk pengelolaan konfigurasi:

- **`.env`**: Konfigurasi lokal yang berisi rahasia developer.
  - ⛔️ **DILARANG COMMIT** file ini ke Git. Pastikan selalu masuk `.gitignore`.
- **`.env.production`**: Konfigurasi khusus untuk build produksi.
- **`.env.example`**: Template konfigurasi.
  - ✅ **WAJIB COMMIT**. File ini hanya berisi nama variabel tanpa nilai rahasia, sebagai panduan bagi developer lain.

**Contoh `.env.example`:**

```ini
# Base URL untuk API Backend
VITE_API_BASE_URL=http://localhost:3000

# Public Key untuk layanan pihak ketiga (Aman untuk Client)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 🔐 API Security

Keamanan aplikasi front-end sangat bergantung pada bagaimana kita menangani data sensitif dan interaksi dengan backend.

### 1. Penyimpanan Token (Authentication)

Metode penyimpanan token otentikasi (seperti JWT) sangat kritikal untuk mencegah serangan XSS (Cross-Site Scripting).

- **Rekomendasi Utama**: Simpan token (Access Token & Refresh Token) di dalam **HttpOnly Cookies**.
  - Cookies jenis ini tidak dapat dibaca oleh JavaScript (`document.cookie`), sehingga kebal terhadap pencurian token via XSS.
  - Atur cookie ini dari sisi server/backend saat login.
- **Alternatif (Kurang Aman)**: Jika terpaksa menggunakan `localStorage` atau `sessionStorage`, sadari risikonya. Jika ada celah XSS di aplikasi, token dapat dicuri. Selalu validasi dan sanitize input dengan ketat.

### 2. Proteksi API Keys

- **Client-Side Keys**: Hanya letakkan API Key yang memang didesain untuk publik (seperti Firebase Config publik atau Stripe Publishable Key) di kode front-end.
- **Server-Side Keys**: Jangan pernah mengekspos API Key layanan pihak ketiga yang bersifat rahasia (seperti OpenAI Secret Key atau AWS Secret Key) di kode React.
  - **Solusi**: Jika butuh memanggil API pihak ketiga yang memerlukan secret key, buatlah endpoint perantara (proxy) di backend kita sendiri. Front-end memanggil backend -> Backend memanggil API pihak ketiga -> Backend mengembalikan hasil ke Front-end.

### 3. Validasi Input (Input Validation)

Jangan pernah mempercayai input dari pengguna. Validasi data sebelum dikirim ke API untuk mencegah _Malformed Data_ atau injeksi.

- Gunakan library **Yup** (sudah terinstall) untuk memvalidasi schema data di sisi klien sebelum melakukan request POST/PUT.
- Validasi sisi klien meningkatkan UX (feedback instan), namun validasi sisi server tetap wajib ada sebagai pertahanan utama.

**Contoh Validasi Yup:**

```typescript
import * as yup from "yup";

const loginSchema = yup.object({
  email: yup.string().email("Email tidak valid").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Password is required"),
});
```

## 📝 Checklist Keamanan

Sebelum melakukan _Pull Request_ atau _Deployment_, pastikan:

1. [ ] Tidak ada file `.env` yang ter-commit ke repositori.
2. [ ] File `.env.example` sudah diperbarui jika ada penambahan variabel baru.
3. [ ] Tidak ada _hardcoded secrets_ di dalam file `.tsx` atau `.ts`.
4. [ ] Semua input user (Form) sudah divalidasi menggunakan Yup schema.
5. [ ] Token sensitif tidak disimpan di `localStorage` (kecuali terpaksa dan risiko sudah dimitigasi).
