# Overview API Layer & Pola Data Fetching

## Pengantar

Dokumen ini menjelaskan standar arsitektur untuk lapisan komunikasi data (API Layer) dalam proyek Vite + React + TypeScript kita. Mengacu pada struktur _feature-based_ yang didefinisikan dalam `overview-structure.md`, kita memisahkan definisi API dari komponen UI untuk menjaga kode tetap bersih, teruji, dan mudah dipelihara.

Dalam ekosistem Single Page Application (SPA) dengan Vite, kita tidak menggunakan _Server Components_ secara native. Sebagai gantinya, kita mengadopsi pola **Client-side Fetching** yang cerdas menggunakan **TanStack Query (React Query)** untuk mengelola _Server State_ (caching, deduping, background updates), yang memberikan pengalaman pengguna setara dengan aplikasi modern lainnya.

---

## 1. Core HTTP Client

Kita menggunakan **Axios** sebagai klien HTTP utama yang dikonfigurasi secara terpusat. Instance tunggal ini (Singleton) bertugas menangani konfigurasi global seperti Base URL, _timeout_, serta injeksi token otentikasi.

### Lokasi & Konfigurasi

File konfigurasi terletak di `src/services/http/instance.ts` (atau `src/lib/axios.ts`).

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Instance terpusat
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Otomatis menyisipkan Token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token"); // Atau dari Cookies/Store
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized (contoh: redirect ke login)
    if (error.response?.status === 401) {
      // Logic logout atau refresh token
    }
    return Promise.reject(error);
  }
);
```

---

## 2. Struktur API Berbasis Fitur

Sesuai dengan `Guidelines.md`, definisi endpoint API harus dikelompokkan berdasarkan fitur di dalam folder `services/[feature]/`. Kita tidak menumpuk semua endpoint dalam satu file raksasa.

### Pola File API

Lokasi: `src/services/[feature]/[feature]Api.ts`

Setiap fungsi API harus:

1.  Menggunakan `axiosInstance`.
2.  Memiliki tipe data kembalian (_return type_) yang eksplisit.
3.  Bersifat _pure async function_ (tidak mengandung hooks di dalamnya).

```typescript
// src/services/products/productApi.ts
import { axiosInstance } from "@/services/http/instance";
import type {
  Product,
  CreateProductPayload,
} from "@/types/products/product.types";

// Definisi Response Type
export interface ProductResponse {
  data: Product;
  message: string;
}

// Fetcher Function (Read)
export async function getProduct(id: string): Promise<Product> {
  const response = await axiosInstance.get<ProductResponse>(`/products/${id}`);
  return response.data.data; // Unwrapping response standar backend
}

// Mutation Function (Write)
export async function createProduct(
  payload: CreateProductPayload
): Promise<Product> {
  const response = await axiosInstance.post<ProductResponse>(
    "/products",
    payload
  );
  return response.data.data;
}
```

---

## 3. Data Fetching Pattern (Pengganti Server Components)

Karena kita menggunakan Vite (Client-side Rendering), kita tidak memanggil fungsi API secara langsung di dalam komponen (`await getProduct()`). Sebagai gantinya, kita menggunakan **TanStack Query** hooks untuk membungkus fungsi API tersebut. Ini memberikan manajemen loading, error, dan caching yang robust.

### Implementasi pada Komponen

Kita memisahkan komponen menjadi dua jenis konseptual:

1.  **Container / Smart Component**: Menggunakan Hooks API dan meneruskan data.
2.  **Presentational / UI Component**: Hanya menerima props data dan merender UI.

```typescript
// src/pages/products/components/ProductDetails.tsx (Smart Component)
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/products/productApi";
import { ProductCard } from "./ProductCard"; // Presentational
import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetails({ id }: { id: string }) {
  // Penggunaan useQuery menggantikan direct await di Server Component
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id], // Unique Key untuk caching
    queryFn: () => getProduct(id),
    staleTime: 1000 * 60 * 5, // Cache valid selama 5 menit
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  // Render Presentational Component
  return <ProductCard product={data} />;
}
```

---

## 4. Pola Mutasi Data (Pengganti Server Actions)

Untuk operasi _Create/Update/Delete_ (seperti Form Submission), kita menggunakan hook `useMutation` dari React Query. Ini menggantikan peran _Server Actions_ pada Next.js.

### Implementasi Form Submission

Hook ini menangani state `isPending` (loading) saat submit dan melakukan _cache invalidation_ setelah sukses agar data di UI otomatis terbarui.

```typescript
// src/pages/products/components/CreateProductForm.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/services/products/productApi";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Library notifikasi

export function CreateProductForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate query agar list produk ter-refresh otomatis
      // (Setara dengan revalidatePath di Next.js)
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil dibuat!");
    },
    onError: (error) => {
      toast.error(`Gagal membuat produk: ${error.message}`);
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Nama Produk" />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
```

---

## 5. Manajemen Error & Loading

Kita menerapkan pola penanganan error dan loading yang konsisten agar UX tetap terjaga.

### Loading States

Gunakan **Suspense** atau pengecekan `isLoading` manual, namun pastikan UI tidak berkedip (_flickering_).

- Gunakan komponen `<Skeleton />` atau `<Spinner />` dari Design System.
- Hindari menampilkan layar putih kosong.

### Error Boundaries

Untuk menangani error yang tidak terduga di level komponen (runtime error), bungkus fitur utama dengan **Error Boundary**.

```typescript
// src/components/common/ErrorBoundary.tsx
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

export class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  // ... implementasi standar Error Boundary React ...
}
```

---

## 6. Route Protection (Middleware Alternative)

Dalam Vite, kita tidak memiliki `middleware.ts` sisi server. Sebagai gantinya, kita menggunakan **Wrapper Component** atau **Custom Hooks** pada level Router untuk memproteksi halaman.

```typescript
// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

## Ringkasan Praktis

| Konsep Next.js (Server) | Implementasi Vite + React (Client)          |
| :---------------------- | :------------------------------------------ |
| **Server Components**   | `useQuery` (React Query) di Smart Component |
| **Server Actions**      | `useMutation` (React Query) + API Call      |
| **revalidatePath**      | `queryClient.invalidateQueries`             |
| **Route Handlers**      | Backend API Terpisah (Express/Go/dll)       |
| **loading.tsx**         | `isLoading` state / `<Suspense>`            |
| **error.tsx**           | `isError` state / Error Boundary            |

Dengan mengikuti pola ini, kita mempertahankan struktur kode yang rapi dan _type-safe_ meskipun berjalan sepenuhnya di sisi klien (_Client-side_).
