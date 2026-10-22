# Overview Component Architecture (Atomic Design)

## Pengantar

Kita mengadopsi metodologi **Atomic Design** yang dimodifikasi untuk mengorganisir komponen UI. Pendekatan ini membantu kita membangun antarmuka yang konsisten, _reusable_, dan mudah dipelihara. Struktur folder komponen mencerminkan hierarki kompleksitas: dari elemen terkecil (Atoms) hingga bagian halaman yang utuh (Organisms).

---

## 1. Utilitas & Pola Dasar

Sebelum masuk ke hierarki, ada dua pola teknis penting yang digunakan dalam setiap komponen.

### Class Merging (`cn`) - **WAJIB**

**PENTING**: Penggunaan fungsi `cn` adalah **WAJIB** untuk semua conditional className. Jangan pernah menggunakan template literal, string concatenation, atau cara lain untuk menggabungkan className.

Setiap komponen harus menerima prop `className` untuk memungkinkan _override_ gaya dari luar. Kita menggunakan helper `cn` (gabungan `clsx` dan `tailwind-merge`) untuk menangani ini dengan aman.

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Contoh Penggunaan Wajib:**

```typescript
// ❌ BAD - Jangan lakukan ini
<div className={`base ${isActive ? 'active' : ''} ${className || ''}`}>

// ✅ GOOD - Selalu gunakan cn
import { cn } from "@/lib/utils";
<div className={cn('base', isActive && 'active', className)}>
```

Fungsi `cn` memastikan:

- Tidak ada konflik class Tailwind (dengan `tailwind-merge`)
- Conditional classes ditangani dengan aman (dengan `clsx`)
- Override className dari props berfungsi dengan benar

### Conditional Rendering (`Show`)

Untuk menjaga JSX tetap bersih dari logika `ternary` atau `&&` yang berantakan, kita menggunakan komponen helper `<Show>`.

```typescript
// components/utils/Show.tsx
import { ReactNode } from "react";

interface ShowProps {
  when: boolean | undefined | null;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Show({ when, children, fallback = null }: ShowProps) {
  return when ? <>{children}</> : <>{fallback}</>;
}
```

---

## 2. Atoms (Komponen Dasar)

**Definisi:** Blok bangunan terkecil yang tidak dapat dipecah lagi tanpa kehilangan fungsinya. Tidak memiliki dependensi ke komponen lain.
**Contoh:** Button, Input, Icon, Typography, Badge, Avatar.

### Pattern: Variant Mapping

Gunakan objek atau `cva` (class-variance-authority) untuk memetakan variasi gaya.

**File:** `src/components/atoms/Button.tsx`

```typescript
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Definisi Varian
const variantClasses = {
  contained: "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
  outline: "bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 border-transparent",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border-transparent",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "contained",
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base classes (Layout, Spacing, Typography)
        "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        // Variant specific classes
        variantClasses[variant],
        // External override
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 animate-spin">⏳</span> // Ganti dengan Icon Spinner
      ) : null}
      {children}
    </button>
  );
}
```

---

## 3. Molecules (Komponen Komposit)

**Definisi:** Gabungan dari beberapa Atom yang membentuk satu fungsi UI yang jelas. Mulai memiliki sedikit logika UI (bukan logika bisnis).
**Contoh:** Form Field (Label + Input + Error), Search Bar (Input + Button), User Card (Avatar + Text).

**File:** `src/components/molecules/Card.tsx`

```typescript
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Show } from "@/components/utils/Show";

interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: ReactNode; // Slot untuk konten custom
}

export function Card({
  title,
  description,
  imageUrl,
  actionLabel,
  onAction,
  className,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden border border-gray-100",
        className
      )}
    >
      {/* Optional Header Image */}
      <Show when={!!imageUrl}>
        <div className="h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </Show>

      <div className="p-5 space-y-4">
        {/* Content Area */}
        <div>
          <Typography variant="h3" className="mb-2">
            {title}
          </Typography>

          <Show when={!!description}>
            <Typography variant="body" className="text-gray-500">
              {description}
            </Typography>
          </Show>
        </div>

        {/* Custom Content Slot */}
        <Show when={!!children}>
          <div className="my-4">{children}</div>
        </Show>

        {/* Footer / Action Area */}
        <Show when={!!actionLabel && !!onAction}>
          <div className="pt-2">
            <Button onClick={onAction} variant="outline" className="w-full">
              {actionLabel}
            </Button>
          </div>
        </Show>
      </div>
    </div>
  );
}
```

---

## 4. Organisms (Komponen Kompleks)

**Definisi:** Bagian utama dari antarmuka yang menyusun molekul dan atom menjadi unit fungsional yang kompleks. Di sinilah seringkali data dari API mulai disuntikkan (jika menggunakan pola Container/Presentational).
**Contoh:** Navbar, Sidebar, ProductList, LoginForm, Footer.

**File:** `src/components/organisms/ProductGrid.tsx`

```typescript
import { Product } from "@/types";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (id: string) => void;
  isLoading?: boolean;
}

export function ProductGrid({
  products,
  onAddToCart,
  isLoading,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        Loading...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">Tidak ada produk ditemukan</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          title={product.name}
          description={product.shortDescription}
          imageUrl={product.thumbnail}
          actionLabel="Tambah ke Keranjang"
          onAction={() => onAddToCart(product.id)}
          className="hover:shadow-lg transition-shadow"
        >
          {/* Inject content ke slot children Card */}
          <div className="flex justify-between items-center font-bold text-lg text-blue-600">
            {product.formattedPrice}
          </div>
        </Card>
      ))}
    </section>
  );
}
```

---

## 5. Prioritas Komponen Existing - **WAJIB**

**PENTING**: Sebelum membuat komponen baru, **WAJIB** untuk:

1. Mencari komponen existing di `src/components` atau `src/pages/[feature]/components`
2. Menggunakan komponen existing sebagai building block atau support component
3. Hanya membuat komponen baru jika benar-benar tidak ada yang sesuai atau perlu customisasi signifikan

**Contoh:**

```typescript
// ❌ BAD - Membuat komponen baru tanpa cek existing
function MyButton() {
  return <button className="px-4 py-2 bg-blue-500">Click</button>;
}

// ✅ GOOD - Gunakan komponen existing
import { Button } from "@/components/ui/button";
function MyFeature() {
  return <Button variant="primary">Click</Button>;
}

// ✅ GOOD - Extend komponen existing jika perlu customisasi
import { Button } from "@/components/ui/button";
function CustomButton({ children, ...props }) {
  return (
    <Button {...props} className={cn("custom-styles", props.className)}>
      {children}
    </Button>
  );
}
```

Prinsip ini memastikan:

- Konsistensi UI di seluruh aplikasi
- Mengurangi duplikasi kode
- Memudahkan maintenance dan update design system

## 6. Panduan & Best Practices

### Penamaan Props

- **Event Handlers**: Gunakan prefix `on` + Kata Kerja. Contoh: `onClick`, `onChange`, `onSubmit`, `onClose`.
- **Boolean**: Gunakan prefix kata tanya atau kondisi. Contoh: `isLoading`, `isOpen`, `isDisabled`, `hasError`.
- **Data**: Gunakan nama noun yang jelas. Contoh: `user`, `items`, `options`.

### Composition vs Configuration

Prioritaskan pola **Composition** (`children`) daripada membuat props konfigurasi yang terlalu banyak (_Prop Explosion_).

**Bad:**

```tsx
<Card
  title="X"
  subtitle="Y"
  footerButtonText="Click"
  footerButtonColor="red"
  showIcon={true}
/>
```

**Good:**

```tsx
<Card title="X">
  <Subtitle>Y</Subtitle>
  <CardFooter>
    <Button variant="destructive">Click</Button>
  </CardFooter>
</Card>
```

### Strict Typography

Jangan pernah menggunakan tag HTML teks (`h1`, `p`, `span`) secara telanjang dengan class acak di dalam Organism atau Page. Gunakan komponen atom **Typography** untuk menjaga konsistensi Design System.

```tsx
// Bad
<h1 className="text-2xl font-bold text-gray-900">Judul</h1>

// Good
<Typography variant="h1">Judul</Typography>
```
