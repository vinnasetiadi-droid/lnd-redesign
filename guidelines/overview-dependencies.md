# Overview Dependensi & Standar Teknis

## Pengantar

Dokumen ini adalah perluasan teknis dari **Guidelines.md**, merinci daftar pustaka (_libraries_) dan standar konfigurasi yang digunakan dalam proyek ini. Pemilihan teknologi di sini didasarkan pada prinsip utama kita: performa tinggi, keamanan tipe (_type safety_) yang ketat, dan efisiensi pengembangan. Daftar ini bukan sekadar rekomendasi, melainkan standar yang harus dipatuhi untuk menjaga konsistensi arsitektur aplikasi.

---

## 1. React Version Requirement - **WAJIB**

**WAJIB**: Gunakan React versi stable (React 18 atau lebih baru).

```json
// package.json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

**Alasan:**

- **Concurrent Features**: Suspense, useTransition, useDeferredValue untuk performa yang lebih baik
- **Automatic Batching**: Optimasi otomatis untuk state updates
- **Improved Performance**: Rendering yang lebih efisien
- **Better TypeScript Support**: Type definitions yang lebih baik
- **Future-Proof**: Mendukung fitur-fitur modern React

**Fitur React 18+ yang Wajib Digunakan:**

- `Suspense` untuk lazy loading dan data fetching
- `useTransition` untuk non-blocking updates
- `useDeferredValue` untuk deferring expensive updates
- Error Boundaries untuk error handling yang lebih baik

---

## 2. Standar TypeScript & Kode

Mengacu pada bab "Standar React dan TypeScript" di Guidelines, kita menerapkan aturan ketat untuk menjamin kualitas kode.

### TypeScript Configuration

- **Strict Mode**: Wajib aktif (`"strict": true`). Kita tidak mentolerir _implicit any_.
- **Type vs Interface**: Gunakan `interface` untuk definisi struktur data objek (seperti Props komponen atau model data API) agar mudah diperluas (_extendable_). Gunakan `type` untuk _Union Types_, _Primitives_, atau tipe data kompleks lainnya.
- **Export Strategy**: Tipe data yang digunakan lintas file harus diekspor secara eksplisit. Hindari mendefinisikan tipe penting di dalam file komponen lokal jika tipe tersebut dibutuhkan oleh komponen lain atau unit test.

### Pola Import (Import Ordering)

Untuk menjaga kerapian file, urutan import harus dikelompokkan sebagai berikut:

1.  **React Core**: `import React from 'react'`
2.  **External Libraries**: `import { motion } from 'framer-motion'`
3.  **Internal Absolute Imports**: Menggunakan alias `@/` (misal: `import { Button } from '@/components/ui/button'`).
4.  **Utils & Hooks**: `import { cn } from '@/lib/utils'`
5.  **Types**: `import type { User } from '@/types'`
6.  **Assets/Styles**: `import './styles.css'`

*Catatan: Gunakan Named Imports untuk utilities dan hooks. Default Imports diperbolehkan untuk komponen halaman (Pages) atau komponen yang di-*lazy load*.*

---

## 3. Pustaka Utama (Core & UI)

### Styling Engine

Sesuai dengan "Design System" di Guidelines, kita menggunakan pendekatan modern:

- **`tailwindcss` (v4)**: Framework styling utama. Kita menulis _utility classes_ langsung di JSX, menghindari file CSS terpisah kecuali untuk konfigurasi global.
- **`tailwind-merge` & `clsx/classnames`**: Wajib digunakan saat membuat komponen _reusable_. `cn()` helper (gabungan keduanya) digunakan untuk menggabungkan class default dengan props class tambahan tanpa konflik styling.

### Component Libraries

- **`shadcn/ui`**: Pustaka komponen utama dengan gaya _New York_. Komponen ini bersifat _copy-paste_, memberikan kita kendali penuh atas kode sumbernya.
- **`@radix-ui/*`**: Primitif _headless_ yang menjadi fondasi aksesibilitas bagi komponen shadcn/ui.

### Icons - **WAJIB: Prioritas Library Existing**

**PENTING**: Sebelum menggunakan icon dari library baru atau membuat custom icon, **WAJIB** untuk:

1. Mencari icon yang dibutuhkan di library yang sudah terpasang terlebih dahulu
2. Menggunakan icon dari library existing sebagai prioritas utama

**Library Icon yang Tersedia:**

- **`iconsax-react`**: Pustaka ikon utama.
- **`lucide-react`**: Pustaka ikon pendukung jika ikon spesifik tidak ditemukan di Iconsax.

**Aturan Penggunaan:**

- Gunakan icon dari `iconsax-react` atau `lucide-react` sebagai prioritas pertama
- Hanya gunakan custom icon atau library icon lain jika icon yang dibutuhkan benar-benar tidak tersedia di kedua library tersebut
- Konsistensi visual sangat penting; usahakan menggunakan satu set ikon dominan di seluruh aplikasi

```typescript
// ❌ BAD - Import dari library baru tanpa alasan kuat
import { SomeIcon } from "react-icons";
import { AnotherIcon } from "heroicons";

// ✅ GOOD - Gunakan dari library existing
import { User, Settings, Home } from "lucide-react";
// atau
import { User, Setting2, Home2 } from "iconsax-react";
```

### Animation

- **`framer-motion`**: Pustaka animasi standar untuk transisi UI deklaratif di React.
- **`gsap`**: Digunakan hanya untuk animasi sekuensial tingkat lanjut atau berbasis _timeline_ yang kompleks.
- **`tailwindcss-animate`**: Plugin untuk animasi CSS sederhana berbasis utility class.

---

## 4. Manajemen State & Data

Kita memisahkan tanggung jawab pengelolaan data sesuai jenisnya:

### Server State (Data API)

- **`@tanstack/react-query`**: Standar mutlak untuk _fetching_ data. Menangani caching, refetching, dan loading state secara otomatis. Jangan simpan data API di useEffect/useState manual.

### Client State (Global UI)

- **`zustand`**: Pilihan utama untuk state global yang ringan (misal: toggle sidebar, preferensi tema).
- **`rematch` (Redux-based)**: Digunakan HANYA jika aplikasi memiliki logika state bisnis yang sangat kompleks dan saling ketergantungan yang sulit ditangani Zustand. Default ke Zustand terlebih dahulu.

---

## 5. API & Komunikasi Real-time

### HTTP Client

- **`axios`**: Klien HTTP standar. Semua request harus melalui instance axios yang terkonfigurasi di folder `src/services/` atau `src/api/` untuk menangani token dan interceptor secara terpusat.

### Real-time

- **`socket.io-client`**: Untuk komunikasi dua arah standar (chat, notifikasi).
- **`livekit-client`**: Spesifik untuk fitur _streaming_ audio/video berkualitas tinggi dan konferensi _real-time_.

---

## 6. Form & Validasi - **REKOMENDASI: React Hook Form**

### 6.1. Rekomendasi Utama: React Hook Form

**WAJIB**: Gunakan **`react-hook-form`** sebagai form library utama dengan pola komposisi yang rapi.

**Alasan:**

- **Komposisi dari Bawah ke Atas**: Setiap komponen input mengelola logikanya sendiri, sangat cocok untuk komposisi
- **Mature & Stable**: Library yang sudah sangat mature dan banyak digunakan di production
- **Performance**: Mengurangi re-render drastis dibandingkan controlled components biasa
- **Type Safety**: Excellent TypeScript support dengan Yup integration
- **Composable**: Mudah membuat komponen input terisolasi dan reusable
- **FormProvider Pattern**: Memungkinkan komposisi form yang kompleks dengan nested objects dan arrays

**Installation:**

```bash
npm install react-hook-form @hookform/resolvers yup
# atau
pnpm add react-hook-form @hookform/resolvers yup
```

### 6.2. Pola Implementasi - **WAJIB**

**WAJIB**: Ikuti pola berikut untuk struktur form yang rapi dan maintainable:

**1. Schema Validasi Terpusat**

```typescript
// src/schemas/userForm.ts
import * as yup from "yup";

// Schema untuk sub-form (nested object)
const addressSchema = yup.object({
  street: yup.string().required("Street is required"),
  city: yup.string().required("City is required"),
  zipCode: yup
    .string()
    .matches(/^\d{5}$/, "Invalid ZIP code")
    .required("ZIP code is required"),
});

// Schema utama
export const userFormSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  // Nested object
  address: addressSchema.optional(),
  // Array of nested objects
  contacts: yup
    .array(
      yup.object({
        type: yup.string().oneOf(["phone", "email"]).required(),
        value: yup.string().required("Contact value is required"),
      })
    )
    .min(1, "At least one contact is required")
    .optional(),
});

export type UserFormData = yup.InferType<typeof userFormSchema>;
```

**2. Komponen Input Terisolasi**

```typescript
// src/components/form/TextField.tsx
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TextFieldProps {
  name: string;
  label: string;
  type?: string;
  className?: string;
}

export function TextField({
  name,
  label,
  type = "text",
  className,
}: TextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        {...register(name)}
        className={cn(errors[name] && "border-red-500")}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="text-sm text-red-500">{message}</p>
        )}
      />
    </div>
  );
}
```

**3. Form dengan FormProvider**

```typescript
// src/components/UserForm.tsx
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userFormSchema, UserFormData } from "@/schemas/userForm";
import { TextField } from "@/components/form/TextField";
import { Button } from "@/components/ui/button";

export function UserForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  isSubmitting?: boolean;
}) {
  const methods = useForm<UserFormData>({
    resolver: yupResolver(userFormSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      address: {
        street: "",
        city: "",
        zipCode: "",
      },
      contacts: [{ type: "phone", value: "" }],
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <TextField name="name" label="Full Name" />
        <TextField name="email" label="Email" type="email" />

        {/* Nested object */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Address</h3>
          <TextField name="address.street" label="Street" />
          <TextField name="address.city" label="City" />
          <TextField name="address.zipCode" label="ZIP Code" />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Submit"}
        </Button>
      </form>
    </FormProvider>
  );
}
```

**Best Practices:**

- **WAJIB**: Schema validasi diletakkan di file terpisah (`src/schemas/`) dan dikelompokkan dengan rapi
- **WAJIB**: Komponen input dibuat terisolasi dan reusable menggunakan `useFormContext`
- **WAJIB**: Menggunakan `FormProvider` untuk menyediakan form context ke child components
- **WAJIB**: Menggunakan `methods.handleSubmit()` dari react-hook-form (bukan manual preventDefault)
- **WAJIB**: Validasi menggunakan Yup dengan `yupResolver` untuk type safety

### 6.3. Validasi Schema

**WAJIB**: Gunakan **`yup`** sebagai schema validator untuk react-hook-form.

**Alasan:**

- Mature dan battle-tested library yang sudah digunakan di banyak production apps
- Runtime validation yang powerful dan fleksibel
- Excellent TypeScript support dengan type inference
- Compatible dengan react-hook-form melalui `@hookform/resolvers`
- Syntax yang mudah dipahami dan readable

**Installation:**

```bash
npm install yup @hookform/resolvers
# atau
pnpm add yup @hookform/resolvers
```

**Contoh Schema:**

```typescript
import * as yup from "yup";

export const userSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  age: yup
    .number()
    .min(18, "Must be 18 or older")
    .max(120, "Invalid age")
    .required("Age is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain uppercase letter")
    .matches(/[a-z]/, "Password must contain lowercase letter")
    .matches(/[0-9]/, "Password must contain number")
    .required("Password is required"),
});

export type UserFormData = yup.InferType<typeof userSchema>;
```

---

## 7. Fitur Khusus & Media

### Rich Content & Files

- **`@tiptap/*`**: Framework editor teks kaya (_headless_) yang dapat dikustomisasi penuh.
- **`react-markdown`**: Untuk merender output markdown dengan aman.
- **`react-pdf`**: Penampil dokumen PDF.
- **`react-dropzone`**: Komponen standar untuk fitur _drag & drop_ upload file.

### Audio/Video Recording

- **`react-webcam`**: Akses kamera sederhana.
- **`recordrtc`**: Pustaka _low-level_ untuk merekam audio/video browser.
- **`hark`**: Utilitas ringan untuk mendeteksi suara (_speech detection_) dalam stream audio.

### Data Visualization

- **`react-chartjs-2`** (Wrapper Chart.js): Solusi utama untuk menampilkan grafik dan diagram data statistik.
- **`katex`**: Rendering formula matematika ilmiah.

---

## 8. Utilitas & Internasionalisasi

### Helper Libraries

- **`lodash`**: Gunakan fungsi spesifik (misal `lodash/debounce`) untuk manipulasi data kompleks.
- **`dayjs`**: **WAJIB** digunakan sebagai library standar untuk manipulasi tanggal dan waktu. Dayjs dipilih karena ukurannya yang kecil, API yang mirip dengan Moment.js, dan performa yang baik. Gunakan konsisten di seluruh proyek.
- **`uuid`**: Pembuatan ID unik di sisi klien.
- **`papaparse`**: Parsing file CSV yang cepat dan andal di browser.

**Contoh Penggunaan Dayjs:**

```typescript
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id"; // Lokalisasi bahasa Indonesia (opsional)

// Aktifkan plugin jika diperlukan
dayjs.extend(relativeTime);

// Format tanggal
const formatted = dayjs().format("DD/MM/YYYY HH:mm");
const relative = dayjs(date).fromNow(); // "2 hours ago"

// Manipulasi tanggal
const tomorrow = dayjs().add(1, "day");
const lastWeek = dayjs().subtract(7, "day");
```

### Internasionalisasi (i18n)

Jika aplikasi mendukung multi-bahasa:

- **`next-i18next`** atau **`next-intl`**: Framework i18n standar (sesuaikan dengan framework yang digunakan, jika Vite murni gunakan `react-i18next`).

---

## Catatan Penting

Semua dependensi di atas harus diinstal dengan memperhatikan kompatibilitas versi. Sebelum menambahkan library baru di luar daftar ini, diskusikan dengan tim untuk memastikan tidak ada duplikasi fungsi (misalnya: jangan menginstal `moment.js` atau `date-fns` jika sudah ada `dayjs` sebagai library standar).
