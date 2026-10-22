# Overview: Best Practices Development

Dokumen ini berisi panduan praktik terbaik (_best practices_) yang harus diikuti dalam pengembangan aplikasi ini untuk memastikan kualitas kode, performa, dan kemudahan pemeliharaan.

## 📋 Best Practices

### 1. Component Composition

Gunakan pola **Composition over Inheritance**. Hindari membuat komponen yang terlalu monolitik atau kompleks dengan banyak _props_ kondisional. Sebaliknya, pecah komponen menjadi bagian-bagian yang lebih kecil dan gunakan `children` prop atau slot pattern untuk menyusun UI.

### 2. Type Safety

Selalu definisikan tipe data (_types_ atau _interfaces_) secara eksplisit untuk:

- **Props Komponen**: Gunakan `interface` untuk mendefinisikan props.
- **API Responses**: Jangan gunakan `any`. Definisikan bentuk data yang diharapkan dari backend.
- **State Management**: Pastikan state memiliki tipe yang jelas.

### 3. Error Handling

Tangani kesalahan dengan baik untuk mencegah aplikasi crash total:

- Gunakan **Error Boundaries** untuk menangkap error pada level komponen React.
- Handle error pada operasi asinkron (API calls) menggunakan `try/catch` atau callback error dari React Query.
- Tampilkan pesan error yang ramah pengguna, bukan stack trace mentah.

### 4. Loading States

Selalu sediakan umpan balik visual saat operasi asinkron sedang berlangsung:

- Tampilkan **Skeleton Loader** atau **Spinner** saat data sedang diambil.
- Disable tombol atau input form saat proses submit sedang berlangsung (`isSubmitting`).
- Hindari "layout shift" drastis saat data selesai dimuat.

### 5. Accessibility (A11y)

Pastikan aplikasi dapat diakses oleh semua pengguna:

- Gunakan **Semantic HTML** (`<main>`, `<section>`, `<button>`, dll) alih-alih hanya `<div>`.
- Tambahkan atribut **ARIA** (seperti `aria-label`, `aria-expanded`) jika elemen interaktif tidak memiliki label teks yang jelas.
- Pastikan navigasi keyboard berfungsi dengan baik.

### 6. Performance

Optimalkan kinerja aplikasi untuk pengalaman pengguna yang lancar:

- **React.memo**: Gunakan untuk mencegah re-render yang tidak perlu pada komponen yang mahal (_expensive components_) secara komputasi.
- **Lazy Loading**: Gunakan `React.lazy` dan `Suspense` untuk memuat komponen halaman atau modal yang berat hanya saat dibutuhkan.
- **Image Optimization**: Optimalkan gambar dengan format modern (WebP/AVIF), tentukan dimensi eksplisit (`width` & `height`) untuk mencegah layout shift, dan gunakan atribut `loading="lazy"` untuk gambar di luar viewport awal.

### 7. Code Organization

Jaga agar basis kode tetap rapi dan terstruktur:

- **Keep components small and focused**: Satu komponen idealnya hanya melakukan satu hal (Single Responsibility Principle).
- **Extract reusable logic**: Pindahkan logika yang kompleks atau berulang ke dalam **Custom Hooks** (folder `src/hooks`).
- **Separate concerns**: Pisahkan kode UI (JSX), logika (Hooks), dan data fetching (Services/Queries).

### 8. Styling dengan Tailwind Colors - **WAJIB**

Saat menulis styles, **WAJIB** untuk selalu prioritaskan Tailwind default color classes:

- Gunakan `text-`, `bg-`, `border-` dengan warna Tailwind default (misal: `text-blue-500`, `bg-gray-100`)
- Hanya gunakan custom color values (hex/rgb/hsl) jika benar-benar tidak ada warna Tailwind yang sesuai
- Hindari penggunaan `text-[#3B82F6]` jika `text-blue-500` sudah tersedia

```typescript
// ❌ BAD
<div className="text-[#3B82F6] bg-[#F3F4F6]">

// ✅ GOOD
<div className="text-blue-500 bg-gray-100">
```

### 9. Icon Library Priority - **WAJIB**

**WAJIB** untuk selalu prioritaskan icon dari library yang sudah terpasang:

- **Primary**: `lucide-react` atau `iconsax-react` (sesuai yang digunakan di project)
- Hanya gunakan custom icon atau library lain jika icon yang dibutuhkan benar-benar tidak tersedia

```typescript
// ❌ BAD - Import dari library baru tanpa alasan
import { SomeIcon } from "some-other-icon-library";

// ✅ GOOD
import { User, Settings, Home } from "lucide-react";
```

### 10. Context7 MCP untuk Dokumentasi dan Setup - **WAJIB**

**WAJIB** untuk selalu menggunakan Context7 MCP tools ketika membutuhkan:

- Code generation
- Setup atau configuration steps
- Dokumentasi library/API
- Resolusi library ID dan mendapatkan library documentation

Context7 harus digunakan secara otomatis tanpa perlu diminta secara eksplisit. Ini memastikan kita selalu menggunakan dokumentasi terbaru dan best practices.

### 11. Standardisasi Format Routing untuk CRUD - **WAJIB**

Untuk operasi CRUD, **WAJIB** menggunakan pola routing yang konsisten:

**PENTING**: Di React Router (Vite/SPA), kita **TIDAK BISA** menggunakan `[id]` sebagai nama folder/file seperti di Next.js. Kita harus menggunakan nama file biasa.

**Struktur Routing Standar:**

- **List/Index**: `pages/[feature]/page.tsx` → `/[feature]`
- **Detail**: `pages/[feature]/DetailPage.tsx` → `/[feature]/:id`
- **Form (Create/Edit)**: `pages/[feature]/FormPage.tsx` → `/[feature]/:id/form`

**Struktur Routing CRUD Sederhana (1 FormPage untuk semua):**

- **List/Index**: `pages/[feature]/page.tsx` → `/[feature]`
- **Create**: `pages/[feature]/FormPage.tsx` → `/[feature]/new`
- **Detail**: `pages/[feature]/FormPage.tsx` → `/[feature]/:id` (view-only)
- **Edit**: `pages/[feature]/FormPage.tsx` → `/[feature]/:id/edit`

**Contoh Implementasi:**

```typescript
// Struktur folder (Standar):
// /users/page.tsx -> UserListPage
// /users/DetailPage.tsx -> UserDetailPage
// /users/FormPage.tsx -> UserFormPage (create & edit)

// Struktur folder (CRUD Sederhana):
// /users/page.tsx -> UserListPage
// /users/FormPage.tsx -> UserFormPage (create, edit, detail)

// Di FormPage.tsx, gunakan useParams dan useLocation untuk menentukan mode:
import { useParams } from "react-router-dom";

export function UserFormPage() {
  const { id } = useParams();
  const isEditMode = id && id !== "new";

  // Gunakan useQuery untuk fetch data jika edit mode
  const { data } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id!),
    enabled: isEditMode,
  });

  // Render form dengan data atau empty untuk create
  return <UserForm initialData={data} isEditMode={isEditMode} />;
}
```

Pola ini memastikan konsistensi struktur routing dan memudahkan navigasi serta maintenance.
