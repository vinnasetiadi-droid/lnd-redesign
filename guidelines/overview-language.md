# Overview Internationalization (i18n)

## Pengantar

Dokumen ini menjelaskan standar implementasi fitur multi-bahasa (Internationalization) dalam aplikasi. Kita menggunakan ekosistem **i18next** (khususnya `react-i18next`) yang merupakan standar industri untuk aplikasi React. Pendekatan kita memprioritaskan pemisahan konten teks dari kode logika (_content separation_), memuat terjemahan secara _lazy-load_ (on demand), dan mendukung struktur URL berbasis locale jika diperlukan.

---

## 1. Arsitektur & Struktur File

Kita menyimpan file terjemahan sebagai aset statis JSON di dalam folder `public`. Ini memungkinkan browser mem-cache file bahasa secara efisien dan memisahkan tugas penerjemah dari pengembang kode.

### Struktur Direktori

```
/public
  /locales
    /id
      common.json      # Kata-kata umum (Button, Label, Error generic)
      auth.json        # Halaman Login/Register
      dashboard.json   # Fitur Dashboard
    /en
      common.json
      auth.json
      dashboard.json
```

### Konsep Namespaces (NS)

Kita menggunakan pola **Multiple Namespaces**. Jangan menumpuk semua teks dalam satu file raksasa `translation.json`. Pecahlah berdasarkan fitur atau konteks halaman (misal: `auth`, `profile`, `settings`).

- **`common.json`**: Untuk teks yang muncul di banyak tempat (Save, Cancel, Submit, Loading...).
- **`[feature].json`**: Untuk teks spesifik fitur tertentu.

---

## 2. Konfigurasi Teknis

Konfigurasi utama terdapat di `src/lib/i18n.ts` (atau `src/i18n.ts`). Kita menggunakan `i18next-http-backend` untuk mengambil file JSON dari folder public secara asinkron.

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // Load translation menggunakan http (memuat file dari /public/locales)
  .use(Backend)
  // Deteksi bahasa user otomatis (Browser, LocalStorage, URL)
  .use(LanguageDetector)
  // Pass i18n instance ke react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: "en", // Bahasa cadangan jika deteksi gagal
    supportedLngs: ["id", "en"], // Whitelist bahasa
    ns: ["common"], // Namespace default yang selalu dimuat
    defaultNS: "common",

    debug: import.meta.env.DEV, // Debug hanya di mode dev

    interpolation: {
      escapeValue: false, // Tidak perlu escape karena React sudah aman dari XSS
    },

    backend: {
      // Path pola untuk memuat file JSON
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    detection: {
      // Urutan prioritas deteksi bahasa
      order: ["path", "localStorage", "navigator"],
      // Opsi untuk mendeteksi dari path (misal: /id/dashboard)
      lookupFromPathIndex: 0,
    },
  });

export default i18n;
```

---

## 3. Implementasi pada Komponen

Gunakan hook `useTranslation` untuk mengakses teks. Selalu definisikan namespace yang digunakan agar library hanya memuat file JSON yang dibutuhkan.

### Penggunaan Dasar

```typescript
import { useTranslation } from "react-i18next";

export function WelcomeMessage() {
  // Load namespace 'home' dan 'common'
  const { t } = useTranslation(["home", "common"]);

  return (
    <div>
      {/* Mengambil dari home.json */}
      <h1>{t("home:welcome_title")}</h1>

      {/* Mengambil dari common.json (default fallback) */}
      <button>{t("save_changes")}</button>
    </div>
  );
}
```

### Interpolasi (Dynamic Values)

Jangan pernah menggabungkan string secara manual (concatenation). Gunakan fitur interpolasi i18next.

**JSON (`id/common.json`):**

```json
{
  "greet_user": "Halo, {{name}}! Anda memiliki {{count}} pesan."
}
```

**Component:**

```typescript
<p>{t("greet_user", { name: "Budi", count: 5 })}</p>
// Output: Halo, Budi! Anda memiliki 5 pesan.
```

### Pluralization (Jamak/Tunggal)

i18next menangani bentuk jamak secara otomatis.

**JSON (`en/cart.json`):**

```json
{
  "item_count_one": "1 Item",
  "item_count_other": "{{count}} Items"
}
```

**Component:**

```typescript
<span>{t("item_count", { count: items.length })}</span>
```

---

## 4. Routing & Locale Management

Dalam SPA (Vite + React Router), kita memiliki dua opsi untuk menangani rute bahasa. Sesuai referensi yang meminta **Locale Routes**, berikut adalah pola implementasinya menggunakan React Router.

### Wrapper Route (URL-based)

Kita membungkus rute aplikasi di dalam parameter dinamis `:lang`.

```typescript
// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// Komponen Pembungkus untuk sinkronisasi URL <-> i18n instance
function LanguageWrapper() {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Jika user akses /id/..., ubah bahasa internal i18n
    if (lang && ["id", "en"].includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return <Outlet />; // Render child routes
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root '/' ke default '/id' */}\n{" "}
      <Route path="/" element={<Navigate to="/id" replace />} />
      {/* Locale Route Wrapper */}
      <Route path="/:lang" element={<LanguageWrapper />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
```

### Mengganti Bahasa

Untuk mengganti bahasa, kita harus mengubah URL, bukan sekadar memanggil fungsi `changeLanguage`.

```typescript
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function LanguageSwitcher() {
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const switchLanguage = (newLang: string) => {
    // Ganti segmen URL saat ini (/id/dashboard -> /en/dashboard)
    const currentPath = location.pathname;
    const newPath = currentPath.replace(`/${lang}`, `/${newLang}`);
    navigate(newPath);
  };

  return (
    <select value={lang} onChange={(e) => switchLanguage(e.target.value)}>
      <option value="id">Indonesia</option>
      <option value="en">English</option>
    </select>
  );
}
```

---

## 5. Best Practices

1.  **Keys Naming**: Gunakan `snake_case` untuk keys. Gunakan struktur nested hanya jika benar-benar perlu pengelompokan logis.
    - _Good_: `welcome_message`, `error_invalid_email`
    - _Avoid_: `Welcome Message` (Natural language keys sulit di-maintenance jika teks berubah).
2.  **Handling Loading**: Karena file JSON dimuat secara asinkron, aplikasi akan menampilkan _fallback_ sebentar saat init pertama. Gunakan `<Suspense>` React.
    ```typescript
    <Suspense fallback={<LoadingSpinner />}>
      <App />
    </Suspense>
    ```
3.  **Format Tanggal/Angka**: Jangan gunakan file JSON untuk format tanggal. Gunakan library **`dayjs`** (library standar proyek) atau API native `Intl.DateTimeFormat` dan `Intl.NumberFormat` yang disesuaikan dengan `i18n.language`.
4.  **Error Messages**: Jangan menerjemahkan pesan error teknis dari backend (coding error). Terjemahkan hanya pesan validasi atau notifikasi user-friendly yang didefinisikan di frontend.

---

Dengan mengikuti panduan ini, aplikasi kita akan siap untuk skala global dengan manajemen konten yang rapi dan terpisah dari logika kode.
