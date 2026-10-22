# Overview Struktur Project: Vite + React + TypeScript

## Pengantar

Dokumen ini memberikan gambaran teknis dan mendalam mengenai arsitektur struktur folder dalam proyek aplikasi web berbasis Vite, React, dan TypeScript. Struktur yang dijabarkan di sini bukanlah susunan acak, melainkan implementasi langsung dari standar yang telah ditetapkan dalam **Guidelines.md**. Setiap keputusan penempatan folder dan file diturunkan dari prinsip pemisahan tanggung jawab (_separation of concerns_), modularitas fitur, dan penerapan Design System yang telah disepakati. Tujuannya adalah agar "peta" proyek ini dapat dibaca dengan mudah oleh engineer manapun yang memahami guideline utama kita.

## Visualisasi Struktur Direktori

Berikut adalah representasi visual dari hierarki folder standar yang kita gunakan. Struktur ini dirancang untuk menyeimbangkan antara _reusability_ komponen UI (sesuai bab "Komponen UI Dasar" di Guidelines) dan isolasi logika bisnis (sesuai bab "Arsitektur" di Guidelines).

```text
project-root/
├── public/                  # Aset statis yang tidak diproses Webpack/Vite (favicon, robots.txt)
├── src/
│   ├── assets/              # Aset gambar, font, ikon yang diimpor ke komponen
│   ├── components/          # Komponen UI Generik (Dumb/Presentational Components)
│   │   ├── common/          # Button, Input, Modal (Building Blocks)
│   │   └── ui/              # Komponen dari library (misal: Shadcn UI)
│   ├── hooks/               # Custom Hooks (Grouping by Fitur)
│   │   └── [feature]/       # Hooks spesifik fitur (misal: hooks/users/, hooks/auth/)
│   ├── layouts/             # Komponen Wrapper Halaman (MainLayout, AuthLayout)
│   ├── lib/                 # Utilitas pihak ketiga yang dikonfigurasi (axios, cn)
│   ├── pages/               # Halaman / Rute Aplikasi (Figma Frames) - Berisi Fitur
│   │   └── [feature]/       # misal: users, auth, products
│   │       ├── components/  # Komponen UI spesifik fitur
│   │       ├── page.tsx     # List/Index page
│   │       ├── DetailPage.tsx # Detail page (opsional, untuk struktur standar)
│   │       └── FormPage.tsx   # Form page (Create & Edit, atau semua untuk CRUD sederhana)
│   ├── providers/           # Global Context Providers (Theme, Auth, Query Wrappers)
│   ├── routes/              # Konfigurasi Routing Terpusat
│   ├── services/            # Definisi API (Grouping by Fitur)
│   │   └── [feature]/       # API spesifik fitur (misal: services/users/, services/auth/)
│   ├── store/               # Global State Management (Zustand/Redux Store)
│   ├── styles/              # Global CSS, Design Tokens, Tailwind Config
│   ├── types/               # Definisi TypeScript (Grouping by Fitur)
│   │   └── [feature]/       # Types spesifik fitur (misal: types/users/, types/auth/)
│   ├── utils/               # Fungsi bantu murni (formatDate, currency)
│   ├── App.tsx              # Root Component (Composition Root)
│   └── main.tsx             # Entry Point
├── .env
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Penjelasan Detail Folder

### `src/components/`: Implementasi UI Building Blocks

Sesuai dengan bagian "Komponen UI Dasar" pada Guidelines, folder ini adalah rumah bagi komponen-komponen presentasional (_dumb components_) yang murni dan _reusable_. Di sini, kita tidak boleh menempatkan logika bisnis yang spesifik terhadap domain tertentu. Subfolder `common/` atau `ui/` berisi elemen-elemen atomik seperti `Button`, `Input`, `Card`, atau `Badge` yang propertinya (props) dipetakan langsung dari varian di Figma. Prinsip utamanya adalah komponen di sini harus bisa digunakan di fitur manapun tanpa menyebabkan error ketergantungan.

### `src/pages/`: Representasi Rute dan Frame Figma dengan Fitur

Merujuk pada bagian "Struktur Folder" dan "Konsistensi Penamaan" di Guidelines, folder `pages/` bertugas merefleksikan URL aplikasi dan Frame utama di desain Figma. Setiap fitur disimpan di dalam folder `pages/[feature]/` dengan struktur sebagai berikut:

- **`pages/[feature]/page.tsx`**: Halaman list/index untuk fitur tersebut
- **`pages/[feature]/DetailPage.tsx`**: Halaman detail untuk item spesifik (opsional, untuk struktur standar)
- **`pages/[feature]/FormPage.tsx`**: Halaman form untuk create dan edit, atau semua operasi untuk CRUD sederhana
- **`pages/[feature]/components/`**: Komponen UI spesifik yang hanya digunakan di fitur tersebut

Contoh struktur untuk fitur `users` (Struktur Standar):

```
pages/
└── users/
    ├── components/          # Komponen spesifik users (UserTable, UserCard, dll)
    ├── page.tsx            # List page
    ├── DetailPage.tsx      # Detail page
    └── FormPage.tsx        # Form page (create & edit)
```

Contoh struktur untuk fitur `users` (CRUD Sederhana):

```
pages/
└── users/
    ├── components/          # Komponen spesifik users (UserTable, dll)
    ├── page.tsx            # List page
    └── FormPage.tsx        # Form page (create, edit, detail)
```

File di dalam folder ini bertindak sebagai orkestrator yang menyusun komponen-komponen dari `components/` dan komponen spesifik fitur menjadi satu tampilan utuh. Halaman ini cenderung minim logika (_logic-less_) karena tugas utamanya hanya memanggil komponen.

### `src/providers/`: Global Context Management

Folder ini berfungsi untuk menghindari "Provider Hell" di dalam `App.tsx`. Semua _wrapper_ global seperti `ThemeProvider`, `AuthProvider`, atau `QueryClientProvider` dikonfigurasi di sini dan disatukan dalam satu komponen (misalnya `AppProviders.tsx`). Hal ini menjaga file `App.tsx` tetap bersih dan fokus pada struktur rute utama.

### `src/routes/`: Konfigurasi Routing Terpusat

Folder `src/routes/` berfungsi sebagai pusat kendali navigasi aplikasi. Di sinilah kita mendefinisikan pemetaan URL ke komponen halaman (`pages`) dan membungkusnya dengan layout yang sesuai (`layouts`). Alih-alih menyebarkan definisi `<Route>` secara acak, kita menggunakan pendekatan konfigurasi terpusat. Ini memudahkan pengelolaan proteksi rute (seperti `PrivateRoute`) dan _lazy loading_.

### `src/layouts/`: Struktur Halaman Konsisten

Folder `src/layouts/` berisi komponen pembungkus utama (_wrapper_) yang menerapkan struktur halaman yang konsisten, seperti `MainLayout` (dengan sidebar dan header) atau `AuthLayout` (tampilan tengah polos untuk login).

### `src/store/`: Global State Management

Folder ini didedikasikan untuk state yang benar-benar global dan diakses oleh banyak fitur sekaligus (misalnya notifikasi toast global atau preferensi user yang persisten). Kita memisahkan state global (`src/store`) dari state server (`React Query` di `hooks/api`) dan state lokal (`useState` di komponen).

### `src/styles/`: Sentralisasi Design System

Folder ini adalah tempat di mana "Design System: Warna dan Tipografi" dari Guidelines diterjemahkan menjadi kode. Di dalamnya terdapat file CSS global dan konfigurasi tema. Ini memastikan bahwa perubahan token warna di Figma hanya perlu diperbarui di satu tempat di kode.

### `src/hooks/`: Custom Hooks (Grouping by Fitur)

Folder `hooks/` menyimpan custom hooks yang dikelompokkan berdasarkan fitur. Setiap fitur memiliki folder sendiri di dalam `hooks/[feature]/` untuk hooks spesifik fitur tersebut. Hooks yang bersifat global atau digunakan lintas fitur dapat diletakkan langsung di `hooks/` tanpa subfolder.

**Struktur:**

- `hooks/[feature]/`: Hooks spesifik fitur (misal: `hooks/users/useUserList.ts`, `hooks/auth/useAuth.ts`)
- `hooks/`: Hooks global yang digunakan lintas fitur (misal: `hooks/useWindowSize.ts`, `hooks/useTheme.ts`)

### `src/utils/`: Fungsi Bantu Murni

Folder `utils/` berisi fungsi murni (pure functions) yang terpisah dari rendering UI (misal: `formatCurrency`, `formatDate`). Fungsi-fungsi ini tidak memiliki dependensi React dan dapat digunakan di mana saja.

### `src/services/`: Definisi API (Grouping by Fitur)

Folder `services/` menangani definisi API yang dikelompokkan berdasarkan fitur. Setiap fitur memiliki folder sendiri di dalam `services/[feature]/` untuk API spesifik fitur tersebut. Konfigurasi dasar seperti Axios instance dapat diletakkan di `services/http/` atau `services/api/`.

**Struktur:**

- `services/[feature]/`: API spesifik fitur (misal: `services/users/userApi.ts`, `services/auth/authApi.ts`)
- `services/http/` atau `services/api/`: Konfigurasi dasar HTTP client (Axios instance, interceptors)

### `src/types/`: Definisi TypeScript (Grouping by Fitur)

Folder `types/` menyimpan definisi TypeScript yang dikelompokkan berdasarkan fitur. Setiap fitur memiliki folder sendiri di dalam `types/[feature]/` untuk types spesifik fitur tersebut. Types yang bersifat global dapat diletakkan langsung di `types/` tanpa subfolder.

**Struktur:**

- `types/[feature]/`: Types spesifik fitur (misal: `types/users/user.types.ts`, `types/auth/auth.types.ts`)
- `types/`: Types global yang digunakan lintas fitur (misal: `types/common.types.ts`, `types/api.types.ts`)

## Penutup

Struktur ini dirancang untuk memaksa kita mengikuti _best practice_ secara alami. Dengan mengorganisir fitur di dalam `pages/[feature]/`, mengelompokkan hooks, services, dan types berdasarkan fitur, serta memisahkan UI generik (`components`) dari UI spesifik fitur, kita menciptakan basis kode yang tidak hanya rapi saat ini, tetapi juga siap untuk berskala besar sesuai visi jangka panjang proyek. Struktur ini memudahkan kolaborasi tim karena setiap fitur memiliki lokasi yang jelas dan terorganisir dengan baik.
