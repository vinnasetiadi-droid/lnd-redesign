# Guidelines: Standar Pengembangan Front-End & Desain Sistem (Vite + React + TypeScript)

## Pengantar

Dokumen ini disusun sebagai konstitusi utama atau _single source of truth_ bagi seluruh tim pengembang front-end dan desainer UI/UX dalam proyek ini. Tujuan utama dari panduan ini adalah untuk menyelaraskan pola pikir antara desain dan kode, memastikan konsistensi visual maupun fungsional di seluruh aplikasi, serta menjaga agar basis kode tetap mudah dipelihara (_maintainable_) dan dikembangkan (_scalable_) dalam jangka panjang. Dengan mengikuti standar yang tertuang di sini, kita memastikan bahwa setiap desain yang lahir di Figma dapat diterjemahkan dengan presisi menjadi kode yang efisien, dan sebaliknya, setiap batasan teknis dapat dipahami sejak tahap perancangan. Kolaborasi yang erat antara disiplin ilmu ini adalah kunci untuk menghasilkan aplikasi web modern yang berkualitas tinggi, berkinerja cepat, dan ramah pengguna.

## Arsitektur dan Struktur Folder

Dalam ekosistem Vite, React, dan TypeScript, kita mengadopsi struktur yang modular dan terorganisir untuk memisahkan tanggung jawab kode secara jelas. Struktur folder kita tidak hanya sekadar tempat penyimpanan file, melainkan refleksi langsung dari arsitektur aplikasi. File entry utama kita, seperti `main.tsx` dan `App.tsx`, berfungsi sebagai gerbang inisialisasi aplikasi. Di sinilah konfigurasi global seperti provider untuk state management, tema, dan routing dipasang. Oleh karena itu, logika bisnis yang kompleks sebaiknya tidak ditulis langsung di sini, melainkan didelegasikan ke dalam komponen-komponen yang lebih spesifik.

Untuk mengelola kompleksitas, kita membagi kode ke dalam beberapa direktori utama di bawah folder `src`. Folder `components` didedikasikan untuk komponen UI yang bersifat _reusable_ dan generik, seperti tombol, input, atau kartu, yang tidak terikat pada logika bisnis spesifik fitur tertentu. Folder `pages` berfungsi sebagai representasi langsung dari rute URL aplikasi dan juga menampung fitur bisnis spesifik. Setiap fitur disimpan di dalam `pages/[feature]/` yang berisi komponen lokal spesifik fitur tersebut. Kita juga memiliki folder `layouts` untuk menangani struktur halaman yang konsisten (seperti sidebar dan header), `hooks` untuk logika React yang dikelompokkan berdasarkan fitur, `utils` untuk fungsi bantu murni, `types` untuk definisi TypeScript yang dikelompokkan berdasarkan fitur, dan `services` untuk menangani komunikasi API yang dikelompokkan berdasarkan fitur dengan backend.

Penting untuk dipahami bahwa struktur ini harus mencerminkan organisasi di Figma. Sebuah "Frame" utama di Figma yang merepresentasikan satu layar penuh sebaiknya diterjemahkan menjadi satu file di dalam folder `pages/[feature]/`. Komponen spesifik yang hanya digunakan di fitur tersebut disimpan di `pages/[feature]/components/`. Bagian-bagian yang berulang di berbagai layar Figma, seperti navigasi atau footer, harus diimplementasikan sebagai komponen di dalam folder `layouts`. Sementara itu, elemen-elemen kecil yang menyusun desain tersebut harus dapat ditemukan padanannya di folder `components`. Pemetaan mental yang jelas ini akan memudahkan developer menemukan lokasi kode dari desain yang sedang mereka kerjakan.

## Standar React dan TypeScript

Kita berkomitmen untuk menggunakan standar pengembangan modern yang ketat namun pragmatis. Seluruh komponen React harus ditulis sebagai **Functional Components** dengan memanfaatkan **React Hooks** untuk manajemen state dan efek samping. Kita tidak lagi menggunakan Class Components. Penamaan komponen wajib mengikuti pola **PascalCase** (contoh: `UserProfile.tsx`), dan setiap komponen sebaiknya memiliki satu tanggung jawab utama (_Single Responsibility Principle_). Untuk memudahkan _refactoring_ dan debugging di masa depan, kita memprioritaskan penggunaan _Named Export_ dibandingkan _Default Export_.

TypeScript adalah fondasi dari keandalan kode kita. Oleh karena itu, penggunaan tipe `any` sangat dilarang kecuali dalam keadaan yang benar-benar mendesak dan terdokumentasi dengan baik. Setiap `props` yang diterima komponen, serta `state` yang dikelola, harus diketik secara kuat (_strongly typed_). Kita mendefinisikan tipe data domain—seperti `User`, `Product`, atau `Transaction`—di dalam folder khusus tipe atau berdekatan dengan fitur yang menggunakannya, sehingga model data kita terpusat dan konsisten. Untuk props komponen, gunakan `interface` atau `type` yang jelas, dan manfaatkan fitur _optional_ atau _union types_ untuk menangani variasi data tanpa membuat kode menjadi rapuh.

Kita juga menerapkan pola pemisahan antara komponen presentasional (_dumb components_) yang hanya bertugas merender UI berdasarkan props, dan komponen kontainer (_smart components_) yang menangani logika bisnis dan pengambilan data. Meskipun tidak harus diterapkan secara kaku di setiap bagian, pola ini sangat membantu dalam menjaga keterbacaan kode dan memudahkan pengujian unit. Kode yang bersih, konsisten, dan terstruktur adalah prioritas utama kita.

## Standar Coding Wajib (Mandatory Coding Standards)

Standar berikut adalah **WAJIB** dan harus dipatuhi tanpa pengecualian dalam setiap baris kode yang ditulis. Standar ini dirancang untuk memastikan konsistensi, maintainability, dan kualitas kode di seluruh proyek.

### 1. Penggunaan Fungsi `cn` untuk Conditional className

**WAJIB**: Selalu gunakan fungsi `cn` (dari `@/lib/utils`) untuk menangani penggabungan dan conditional className. Jangan pernah menggunakan template literal atau concatenation string untuk className.

```typescript
// ❌ BAD - Jangan lakukan ini
<div className={`base-class ${isActive ? 'active' : ''} ${className || ''}`}>

// ✅ GOOD - Gunakan cn function
import { cn } from '@/lib/utils';
<div className={cn('base-class', isActive && 'active', className)}>
```

Fungsi `cn` menggabungkan `clsx` dan `tailwind-merge` untuk memastikan tidak ada konflik class Tailwind dan menangani conditional classes dengan aman.

### 2. Prioritas Tailwind Default Color Classes

**WAJIB**: Saat menulis styles, selalu prioritaskan penggunaan Tailwind default color classes (`text-`, `bg-`, `border-`, dll.) terlebih dahulu. Hanya gunakan custom color values (hex/rgb/hsl) jika benar-benar tidak ada warna Tailwind yang sesuai.

```typescript
// ❌ BAD - Jangan gunakan custom color jika ada Tailwind equivalent
<div className="text-[#3B82F6] bg-[#F3F4F6]">

// ✅ GOOD - Gunakan Tailwind default colors
<div className="text-blue-500 bg-gray-100">

// ✅ ACCEPTABLE - Custom color hanya jika tidak ada Tailwind equivalent
<div className="text-[#FF6B9D]"> {/* Brand color spesifik */}
```

### 3. Prioritas Komponen Existing sebagai Support Component

**WAJIB**: Sebelum membuat komponen baru, selalu cek dan prioritaskan penggunaan komponen existing yang sudah ada di `src/components` atau `src/pages/[feature]/components`. Komponen existing harus digunakan sebagai building block atau support component untuk komponen baru.

```typescript
// ❌ BAD - Membuat komponen baru dari scratch
function CustomButton() {
  return <button>...</button>;
}

// ✅ GOOD - Gunakan komponen existing
import { Button } from "@/components/ui/button";
function MyFeatureButton() {
  return <Button variant="primary">...</Button>;
}
```

Prinsip ini memastikan konsistensi UI dan mengurangi duplikasi kode.

### 4. Prioritas Library Icon Existing

**WAJIB**: Selalu prioritaskan penggunaan icon dari library yang sudah terpasang:

- **Primary**: `lucide-react` atau `iconsax-react` (sesuai yang sudah digunakan di project)
- Hanya gunakan custom icon atau library icon lain jika icon yang dibutuhkan benar-benar tidak tersedia di library existing

```typescript
// ❌ BAD - Import dari library baru tanpa alasan kuat
import { SomeIcon } from "some-other-icon-library";

// ✅ GOOD - Gunakan dari library existing
import { User, Settings, Home } from "lucide-react";
// atau
import { User, Setting2, Home2 } from "iconsax-react";
```

### 5. Penggunaan Context7 MCP untuk Dokumentasi dan Setup

**WAJIB**: Selalu gunakan Context7 MCP tools ketika membutuhkan:

- Code generation
- Setup atau configuration steps
- Dokumentasi library/API
- Resolusi library ID dan mendapatkan library documentation

Context7 harus digunakan secara otomatis tanpa perlu diminta secara eksplisit. Ini memastikan kita selalu menggunakan dokumentasi terbaru dan best practices dari library yang digunakan.

### 6. Standardisasi Format Routing untuk CRUD Operations

**WAJIB**: Untuk operasi CRUD, gunakan pola routing yang konsisten dengan format berikut:

**PENTING**: Di React Router (Vite/SPA), kita **TIDAK BISA** menggunakan `[id]` sebagai nama folder/file seperti di Next.js. Kita harus menggunakan nama file biasa.

**Struktur Standar:**

- **List/Index**: `pages/[feature]/page.tsx` → `/[feature]`
- **Detail**: `pages/[feature]/DetailPage.tsx` → `/[feature]/:id`
- **Form (Create/Edit)**: `pages/[feature]/FormPage.tsx` → `/[feature]/:id/form`

**Struktur CRUD Sederhana (1 FormPage untuk semua):**

- **List/Index**: `pages/[feature]/page.tsx` → `/[feature]`
- **Create**: `pages/[feature]/FormPage.tsx` → `/[feature]/new`
- **Detail**: `pages/[feature]/FormPage.tsx` → `/[feature]/:id` (view-only)
- **Edit**: `pages/[feature]/FormPage.tsx` → `/[feature]/:id/edit`

```typescript
// Contoh struktur routing untuk CRUD User (Standar):
// /users -> UserListPage (page.tsx)
// /users/:id -> UserDetailPage (DetailPage.tsx)
// /users/:id/form -> UserFormPage (FormPage.tsx) - untuk create (id='new') dan edit

// Contoh struktur routing untuk CRUD User (Sederhana):
// /users -> UserListPage (page.tsx)
// /users/new -> UserFormPage (FormPage.tsx) - create mode
// /users/:id -> UserFormPage (FormPage.tsx) - detail mode (view-only)
// /users/:id/edit -> UserFormPage (FormPage.tsx) - edit mode

// Di dalam FormPage.tsx, gunakan useParams dan useLocation untuk menentukan mode:
const { id } = useParams();
const location = useLocation();
const isCreateMode = location.pathname === "/users/new";
const isEditMode = location.pathname.includes("/edit");
const isDetailMode = !isCreateMode && !isEditMode && !!id;
```

Pola ini memastikan konsistensi struktur routing dan memudahkan navigasi serta maintenance.

## Design System (Figma Tokens Reference)

> **Mode:** Mode 1
> Sources: `Mode 1.tokens.json` (Figma Variables) · `typography.css` · Lucide Icons (1666 icons)
>
> **WAJIB**: Seluruh nilai warna, tipografi, spacing, dan komponen di bawah ini adalah _single source of truth_ dari Figma. Gunakan token/hex yang tertera di sini — jangan mengarang nilai sendiri.

---

### Typography — Type Scale

| Style | Tag / Class | Size | Weight | Line Height | Ratio |
|-------|------------|------|--------|-------------|-------|
| Heading 1 | `h1` | 32px | 700 — Bold | 40px | 1.25 |
| Heading 2 | `h2` | 24px | 600 — SemiBold | 32px | 1.33 |
| Heading 3 | `h3` | 20px | 600 — SemiBold | 28px | 1.4 |
| Heading 4 | `h4` | 16px | 600 — SemiBold | 24px | 1.5 |
| Body L | `.body-l` | 16px | 400 — Regular | 24px | 1.5 |
| Body M | `.body-m` | 14px | 400 — Regular | 20px | 1.43 |
| Body S | `.body-s` | 12px | 400 — Regular | 16px | 1.33 |
| Button | `.button` | 14px | 600 — SemiBold | 16px | 1.14 |
| Caption | `.caption` | 12px | 400 — Regular | 16px | 1.33 |

#### CSS Reference

```css
h1 { font-size: 32px; font-weight: 700; line-height: 40px; }
h2 { font-size: 24px; font-weight: 600; line-height: 32px; }
h3 { font-size: 20px; font-weight: 600; line-height: 28px; }
h4 { font-size: 16px; font-weight: 600; line-height: 24px; }

.body-l  { font-size: 16px; font-weight: 400; line-height: 24px; }
.body-m  { font-size: 14px; font-weight: 400; line-height: 20px; }
.body-s  { font-size: 12px; font-weight: 400; line-height: 16px; }

.button  { font-size: 14px; font-weight: 600; line-height: 16px; }
.caption { font-size: 12px; font-weight: 400; line-height: 16px; }
```

#### When to Use Each Style

| Style | Use for |
|-------|---------|
| `h1` | Main page title only — one per page |
| `h2` | Section titles, modal headers |
| `h3` | Sub-section titles, card headers |
| `h4` | Label groups, sidebar headings |
| `.body-l` | Primary reading content, descriptions, paragraphs |
| `.body-m` | Secondary content, list items, form labels |
| `.body-s` | Helper text, metadata, timestamps |
| `.button` | All button labels, tab labels, links in nav |
| `.caption` | Image captions, footnotes, badges, tags |

#### Typography Best Practices

- Use `h1` sparingly — only one per page, for the main title
- Maintain consistent heading order: `h1 → h2 → h3 → h4` — never skip levels
- Use **Regular (400)** for all body and caption text
- Use **600** for UI elements — buttons, headings h2–h4, labels
- Use **Bold (700)** for `h1` only
- Never mix more than **3 weights** on a single screen
- Pair text colors with sufficient contrast: prefer `Neutral.700` (`#414651`) on light surfaces

#### Responsive Scaling (Mobile −15%)

| Style | Desktop | Mobile |
|-------|---------|--------|
| `h1` | 32px / 40px lh | 27px / 34px lh |
| `h2` | 24px / 32px lh | 20px / 28px lh |
| `h3` | 20px / 28px lh | 17px / 24px lh |
| `h4` | 16px / 24px lh | 14px / 20px lh |
| `.body-l` | 16px / 24px lh | 14px / 20px lh |
| `.body-m` | 14px / 20px lh | 12px / 16px lh |

---

### Icon Library — Lucide Icons

> **Source:** Lucide Icons — Full Collection (1666 icons)
> **Style:** Outline, 24×24px, 2px stroke, rounded caps & joins
> **License:** ISC (open source, free for commercial use)

| Property | Value |
|----------|-------|
| Default size | 24×24px |
| Stroke width | 2px |
| Available sizes | 16px · 20px · 24px · 32px · 48px |

#### Icon Sizing

- **16px** — inline with small text (`.body-s`, `.caption`)
- **20px** — inline with body text (`.body-m`, `.body-l`)
- **24px** — default, standalone icons, nav items, buttons
- **32px** — feature icons, empty states
- **48px** — hero / illustration icons

#### Icon Color Tokens

| Context | Token | Hex |
|---------|-------|-----|
| Default icon | `Neutral.500` | `#717680` |
| Active / selected | `Primary.600` | `#1570EF` |
| Disabled | `Neutral.300` | `#D5D7DA` |
| Success | `Success.600` | `#039855` |
| Warning | `Warning.600` | `#DC6803` |
| Error | `Error.600` | `#D92D20` |
| On dark bg | `Neutral.025` | `#FDFDFD` |

#### Icon with Buttons

- Pair icon at **20px** with `.button` text (14px/600)
- Keep **8px gap** between icon and label
- Left-icon for action buttons, right-icon for directional (arrows, chevrons)
- Standalone icons: minimum tap target **40×40px** with 8–10px padding
- Always add `aria-label` or tooltip when icon has no visible text label

#### Usage in React

```jsx
import { Home, Settings, Bell } from 'lucide-react';

<Bell />                          // Default (24px, currentColor)
<Bell size={20} color="#1570EF" /> // Custom size & color
<Bell size={24} strokeWidth={1.5} />
```

---

### Color Tokens

> **Source:** `Mode 1.tokens.json` (Figma Variables Export)

#### Neutral

| Token | Hex | Usage |
|-------|-----|-------|
| `Neutral.025` | `#FDFDFD` | Near-white surface |
| `Neutral.050` | `#FAFAFA` | Subtle background |
| `Neutral.100` | `#F5F5F5` | Light background |
| `Neutral.200` | `#E9EAEB` | Divider / border light |
| `Neutral.300` | `#D5D7DA` | Border default |
| `Neutral.400` | `#A4A7AE` | Placeholder / disabled |
| `Neutral.500` | `#717680` | Icon / muted |
| `Neutral.600` | `#535862` | Secondary text |
| `Neutral.700` | `#414651` | Body text |
| `Neutral.800` | `#252B37` | Heading |
| `Neutral.900` | `#181D27` | Strong heading |
| `Neutral.950` | `#0A0D12` | Near-black |

#### Primary

| Token | Hex | Usage |
|-------|-----|-------|
| `Primary.25` | `#F5FAFF` | Subtle tint |
| `Primary.50` | `#EFF8FF` | Light tint |
| `Primary.100` | `#D1E9FF` | Hover background |
| `Primary.200` | `#B2DDFF` | Selected background |
| `Primary.300` | `#84CAFF` | Light accent |
| `Primary.400` | `#5381FD` | Accent |
| `Primary.500` | `#00A3FF` | Active / highlight |
| `Primary.600` | `#1570EF` | **Brand primary** |
| `Primary.700` | `#175CD3` | Hover state |
| `Primary.800` | `#1849A9` | Pressed state |
| `Primary.900` | `#194185` | Dark accent |
| `Primary.950` | `#0001FE` | Deepest blue |

#### Additional Primary

| Token | Hex |
|-------|-----|
| `AdditionalPrimary.PrimaryTeal` | `#60D0AC` |
| `AdditionalPrimary.PrimaryGreen` | `#7EDB56` |

#### Success

| Token | Hex |
|-------|-----|
| `Success.25` | `#F6FEF9` |
| `Success.Color` | `#ECFDF3` |
| `Success.100` | `#D1FADF` |
| `Success.200` | `#A6F4C5` |
| `Success.300` | `#6CE9A6` |
| `Success.400` | `#32D583` |
| `Success.500` | `#12B76A` |
| `Success.600` | `#039855` |
| `Success.700` | `#027A48` |
| `Success.800` | `#05603A` |
| `Success.900` | `#054F31` |
| `Success.950` | `#053321` |

#### Warning

| Token | Hex |
|-------|-----|
| `Warning.25` | `#FFFCF5` |
| `Warning.50` | `#FFFAEB` |
| `Warning.100` | `#FEF0C7` |
| `Warning.200` | `#FEDF89` |
| `Warning.300` | `#FEC84B` |
| `Warning.400` | `#FDB022` |
| `Warning.500` | `#F79009` |
| `Warning.600` | `#DC6803` |
| `Warning.700` | `#B54708` |
| `Warning.800` | `#93370D` |
| `Warning.900` | `#7A2E0E` |
| `Warning.950` | `#4E1D09` |

#### Error

| Token | Hex |
|-------|-----|
| `Error.25` | `#FFFBFA` |
| `Error.Color` | `#FEF3F2` |
| `Error.100` | `#FEE4E2` |
| `Error.200` | `#FECDCA` |
| `Error.300` | `#FDA29B` |
| `Error.400` | `#F97066` |
| `Error.500` | `#F04438` |
| `Error.600` | `#D92D20` |
| `Error.700` | `#B42318` |
| `Error.800` | `#912018` |
| `Error.900` | `#7A271A` |
| `Error.950` | `#55160C` |

#### Extended Color Palettes

(Blue · Blue Light · Blue Grey · Indigo · Purple · Pink · Rose · Orange — each has tokens from `.25` to `.950`. See `/src/imports/design-system-colors.md` for the full table.)

Key highlights:

| Palette | Token.600 (primary shade) |
|---------|--------------------------|
| Blue | `#1570EF` |
| Blue Light | `#0086C9` |
| Blue Grey | `#3E4784` |
| Indigo | `#444CE7` |
| Purple | `#6938EF` |
| Pink | `#DD2590` |
| Rose | `#E31B54` |
| Orange | `#EC4A0A` |

#### Semantic Color Aliases

| Role | Token | Hex |
|------|-------|-----|
| **Brand / CTA** | `Primary.600` | `#1570EF` |
| **Brand hover** | `Primary.700` | `#175CD3` |
| **Brand active** | `Primary.800` | `#1849A9` |
| **Body text** | `Neutral.700` | `#414651` |
| **Secondary text** | `Neutral.600` | `#535862` |
| **Placeholder** | `Neutral.400` | `#A4A7AE` |
| **Border default** | `Neutral.300` | `#D5D7DA` |
| **Surface subtle** | `Neutral.050` | `#FAFAFA` |
| **Surface base** | `Neutral.025` | `#FDFDFD` |
| **Success default** | `Success.600` | `#039855` |
| **Success bg** | `Success.Color` | `#ECFDF3` |
| **Warning default** | `Warning.600` | `#DC6803` |
| **Error default** | `Error.600` | `#D92D20` |
| **Error bg** | `Error.Color` | `#FEF3F2` |

---

### Spacing System

> **Base unit:** 4px — every gap, padding, and margin is a multiple of 4.

| Token | Value | Typical Use |
|-------|-------|-------------|
| `--sp-1` | 4px | Icon nudge, focus-ring gap |
| `--sp-2` | 8px | Icon↔label, badge↔text, inline action gap |
| `--sp-3` | 12px | List-row vertical padding, card-section gap |
| `--sp-4` | 16px | Card-grid gap, nav-item padding, KPI-grid gap |
| `--sp-5` | 20px | Card horizontal padding (standard) |
| `--sp-6` | 24px | Page side padding, topbar padding |
| `--sp-8` | 32px | Major-section separator, page-content gap |
| `--sp-10` | 40px | Large section spacing |
| `--sp-12` | 48px | Hero / banner padding |
| `--sp-16` | 64px | Full-bleed section top padding |

#### Layout Anatomy

| Area | Property | Value |
|------|----------|-------|
| Sidebar | Width | 220px |
| Sidebar | Nav item padding | 8px 16px |
| Sidebar | Icon↔label gap | 8px |
| Topbar | Height | 44–56px |
| Topbar | Padding | 0 24px |
| Page Content | Padding | 24px top/bottom · 32px sides |
| Page Content | Section separator gap | 32px |
| KPI row | Grid gap | 16px |
| Chart 2-col grid | Gap | 20px |

#### Card Spacing Variants

| Variant | Padding | Use Case |
|---------|---------|----------|
| Compact | 16px · 20px | KPI cards, dense tables |
| **Standard** | **20px · 24px** | **Most content cards** |
| Large | 24px · 32px | Hero sections, landing blocks |

#### Spacing Rules

1. Use only multiples of 4px — never 13px, 22px, or 7px
2. Apply consistent 24px page padding on both sides of the content area
3. Separate major layout sections with 32px
4. Keep card-grid gaps at 16px across the same row
5. Icon-to-label gap is always 8px — no exceptions
6. Never drop page-content padding below 20px on either axis

---

### Component Specs

#### Button

| Property | Value |
|----------|-------|
| Types | Primary · Secondary · Tertiary · Ghost · Success · Alert |
| Sizes | L (48px) · M (40px) · S (32px) · XS (24px) |
| States | Default · Hover · Focus · Disabled |
| Focus ring | 2px solid `Primary.600` `#1570EF`, offset 3px |
| Disabled | bg `Neutral.100` `#F5F5F5` · text `Neutral.400` `#A4A7AE` |

**Size Specs:**

| Size | Height | Padding | Border-radius | Font | Icon |
|------|--------|---------|---------------|------|------|
| `L` | 48px | 12px | 8px | 16px/500 | 16px |
| `M` | 40px | 8px 12px | 6px | 16px/500 | 16px |
| `S` | 32px | 8px 10px | 4px | 14px/500 | 12px |
| `XS` | 24px | 10px 8px | 3px | 12px/500 | 12px |

**Color Mapping:**

| Type | Default bg | Default text | Hover bg |
|------|-----------|-------------|----------|
| Primary | `#0001FE` (Primary.950) | `#FDFDFD` | brightness(0.92) |
| Secondary | `#F5F5F5` (Neutral.100) | `#0A0D12` | `#E9EAEB` |
| Tertiary | transparent + border `#E9EAEB` | `#414651` | `#F5F5F5` bg + `#D5D7DA` border |
| Ghost | transparent | `#414651` | `#F5F5F5` |
| Success | `#12B76A` (Success.500) | `#FDFDFD` | `#039855` |
| Alert | `#F04438` (Error.500) | `#FDFDFD` | `#D92D20` |

---

#### Badge

| Property | Value |
|----------|-------|
| Padding | 2px 8px |
| Border-radius | 4px |
| Font weight | 500 — Medium |
| Sizes | Xs (10px) · Sm (12px) · Md (14px) |

**Color Mapping:**

| Type | Background | Text |
|------|-----------|------|
| Primary | `#D1E9FF` (Primary.100) | `#194185` (Primary.900) |
| Neutral | `#F5F5F5` (Neutral.100) | `#0A0D12` (Neutral.950) |
| Green | `#D1FADF` (Success.100) | `#027A48` (Success.700) |
| Yellow | `#FEF0C7` (Warning.100) | `#B54708` (Warning.700) |
| Red | `#FEE4E2` (Error.100) | `#B42318` (Error.700) |

---

#### Input Field

| Property | Regular | Large |
|----------|---------|-------|
| Height | 48px | 72px |
| Border radius | 8px | 8px |
| Background | `#FDFDFD` (Neutral.025) | `#FDFDFD` |
| Content padding | 0 12px | 0 20px |

**States:**

| State | Border | Text colour |
|-------|--------|-------------|
| Default | `#E9EAEB` (Neutral.200) | `#A4A7AE` placeholder |
| Active / Focused | `#0A0D12` (Neutral.950) | `#0A0D12` |
| Filled | `#E9EAEB` | `#0A0D12` |
| Destructive | `#D92D20` (Error.600) | `#0A0D12` |
| Disabled | `#E9EAEB` | `#A4A7AE` + 50% opacity |

---

#### Chip

| Property | Value |
|----------|-------|
| Border-radius | 6px |
| Typography | 14px / 500 / 20px lh |

| State | Background | Text |
|-------|-----------|------|
| Default | `#F5F5F5` (Neutral.100) | `#0A0D12` (Neutral.950) |
| Hover | `#FAFAFA` (Neutral.050) | `#0A0D12` |
| Active | `#0001FE` (Primary.950) | `#F5FAFF` (Primary.25) |
| Disabled | `#FAFAFA` | `#A4A7AE` (Neutral.400) |

---

#### Selector (Checkbox & Radio)

| Property | Value |
|----------|-------|
| Size | 20×20px |
| Border (default) | 1px solid `#A4A7AE` (Neutral.400) |
| Selected bg+border | `#0001FE` (Primary.950) |
| Label font | 16px / 400 / 24px lh |
| Focus ring | 2px solid `#1570EF` (Primary.600), offset 4px |

---

#### Toggle

| Property | Value |
|----------|-------|
| Track | 40×24px, pill radius |
| Knob | 16×16px |
| Off bg | `#E9EAEB` (Neutral.200) |
| On bg | `#0A0D12` (Neutral.950) |

---

#### Table

| Property | Value |
|----------|-------|
| Row height (default) | 52px |
| Header height | 44px |
| Cell padding | 12px 16px |
| Row border | 1px solid `#E9EAEB` (Neutral.200) |
| Header background | `#FAFAFA` (Neutral.050) |
| Header text | 12px / 600 / uppercase / `#717680` (Neutral.500) |
| Body text | 14px / 400 / `#252B37` (Neutral.800) |
| Row hover | `#FAFAFA` |
| Container border-radius | 12px |

---

#### Dropdown

| Property | Value |
|----------|-------|
| Width | 280px |
| Background | `#FDFDFD` (Neutral.025) |
| Border | 1px solid `#E9EAEB` (Neutral.200) |
| Border radius | 8px |
| Item height | 40px |
| Shadow | `0 12px 16px rgba(16,24,40,0.08), 0 4px 6px rgba(16,24,40,0.03)` |

---

#### Alert

| Type | Background | Border | Text |
|------|-----------|--------|------|
| Info | `#F5FAFF` (Primary.25) | `#84CAFF` (Primary.300) | `#1849A9` (Primary.800) |
| Warning | `#FFFAEB` (Warning.50) | `#F8DBC8` | `#57321D` |
| Error | `#FFFBFA` (Error.25) | `#FDA29B` (Error.300) | `#912018` / `#D92D20` |
| Neutral | `#FAFAFA` (Neutral.050) | `#E9EAEB` (Neutral.200) | `#414651` (Neutral.700) |

---

#### Modal

| Property | Value |
|----------|-------|
| Width | 540px |
| Background | `#FDFDFD` (Neutral.025) |
| Border radius | 16px |
| Backdrop | `rgba(16,24,40,0.5)` |
| Shadow | `0 24px 48px −12px rgba(16,24,40,0.18)` |

**Footer buttons:** Ghost · Outline · Secondary · Primary — all 16px/500 · `border-radius: 6px`

---

#### Sidebar Navigation

| Property | Value |
|----------|-------|
| Width | 200px |
| Background | Gradient `Primary.950` → `Primary.500` → `#60D0AC` |
| Nav item height | 32px |
| Nav item border-radius | 8px |
| Icon size | 16px |
| Icon–label gap | 10px |

**Nav item states:**

| State | Background | Text |
|-------|-----------|------|
| Default | Transparent | `#FDFDFD` (Neutral.025) |
| Hover | `rgba(255,255,255,0.1)` | `#FDFDFD` |
| Active (top-level) | `rgba(255,255,255,0.15)` | White |
| Active sub-item | `#1570EF` (Primary.600) | White |

---

#### Charts

| Token | Role | Hex |
|-------|------|-----|
| `--ch-blue-1` | Soft blue — tertiary | `#53B1FD` |
| `--ch-blue-2` | Medium blue — secondary | `#2E90FA` |
| `--ch-blue-3` | Strong blue — primary | `#1570EF` |
| `--ch-teal-1` | Light teal — tertiary | `#5EEAD4` |
| `--ch-teal-2` | Bright teal — secondary | `#2DD4BF` |
| `--ch-teal-3` | Deep teal — emphasis | `#14B8A6` |
| `--ch-grid` | Grid lines | `#F2F4F7` |
| `--ch-axis` | Axis label text | `#9AA0AC` |

**Rules:** Max 3 series per chart. Color order: Blue 3 → Teal 2 → Blue 1. No vertical grid lines. Bar radius `rx=4` on top only.

---

#### Cards (LMS Course Cards)

| Property | Value |
|----------|-------|
| Background | `#fff` |
| Border | `1px solid #E9EAEB` |
| Border radius | 12px |
| Shadow (default) | `0 1px 3px rgba(16,24,40,0.06)` |
| Shadow (hover) | `0 8px 24px rgba(16,24,40,0.10)` |
| Hover lift | `translateY(-2px)` |
| Thumbnail | 16/9 aspect ratio, flush (no padding) |
| Content padding | 16px (standard) |
| Progress bar | 4px height, gradient `#2E90FA → #2DD4BF` |

---

### WCAG Usage Rules

#### Text Guidelines

- **Body text:** Neutral-800/900 on light backgrounds
- **Links:** Brand-700+
- **Status text:** 700+ on light bg, 500+ for fills
- **Avoid text on Brand-500** (insufficient contrast)

#### Button & Component Guidelines

- **Buttons:** White text only on 600+
- **Primary CTA:** Use Brand-950 with white text
- **Icons/Focus:** Brand-500 for accents
- **Disabled states:** Neutral-300/400

#### WCAG Contrast Requirements

| Text Type | AA Standard | AAA Standard |
|-----------|-------------|--------------|
| Normal text (under 18pt) | **4.5:1** | **7:1** |
| Large text (18pt+ or 14pt+ bold) | **3:1** | **4.5:1** |
| UI components & focus indicators | **3:1** | — |

> **Full design system reference** (all extended color palettes, CSS code blocks, and detailed component anatomy): see `/src/imports/design-system-colors.md`

## Pedoman User Experience (UX)

Aplikasi yang baik tidak hanya terlihat bagus, tetapi juga terasa nyaman digunakan. Navigasi aplikasi harus intuitif dan konsisten. Apakah kita menggunakan Sidebar, Top Bar, atau kombinasi keduanya, pola tersebut harus dipertahankan di seluruh halaman agar pengguna tidak perlu mempelajari ulang cara berpindah tempat. Perhatikan juga transisi navigasi di perangkat mobile, di mana ruang layar lebih terbatas dan interaksi berbasis sentuhan.

Sistem _feedback_ adalah aspek krusial lainnya. Aplikasi harus selalu berkomunikasi dengan pengguna tentang apa yang sedang terjadi. Jangan biarkan pengguna menatap layar kosong; gunakan **Skeleton Loader** atau indikator pemuatan yang halus saat data sedang diambil. Desainlah **Empty State** yang informatif dan mengajak bertindak ketika data belum tersedia, bukan sekadar membiarkan area kosong. Demikian pula dengan pesan **Error** dan **Success**; pesan ini harus tampil jelas, menggunakan warna yang sesuai, dan memberikan konteks atau solusi, bukan sekadar kode kesalahan teknis.

Dalam hal pengisian data (Form), UX harus sangat diperhatikan. Label harus selalu terlihat jelas, placeholder digunakan sebagai contoh format dan bukan pengganti label, serta pesan error validasi harus muncul dekat dengan field yang bermasalah. Berikan umpan balik visual instan saat pengguna berinteraksi dengan field input (misalnya warna border berubah saat fokus), sehingga pengguna tahu di mana posisi kursor mereka berada.

## Aksesibilitas (Accessibility)

Aksesibilitas bukan fitur tambahan, melainkan persyaratan dasar. Sejak tahap desain di Figma, kita harus memastikan bahwa aplikasi dapat digunakan oleh seluas mungkin pengguna, termasuk mereka yang memiliki keterbatasan. Pastikan rasio kontras warna antara teks dan latar belakang memenuhi standar WCAG AA. Jangan pernah menggunakan warna sebagai satu-satunya indikator status (misalnya, error tidak boleh hanya ditandai dengan warna merah, tapi juga harus disertai ikon atau teks penjelas).

Elemen interaktif harus memiliki ukuran target sentuh yang cukup besar (minimal 44x44 pixel untuk perangkat mobile) agar mudah diakses. Selain itu, desain visual fokus (_focus state_) untuk navigasi keyboard harus terlihat jelas dan tidak boleh dihilangkan. Meskipun implementasi teknis seperti atribut ARIA dan struktur HTML semantik adalah tanggung jawab engineer, desain harus mendukung struktur hierarki yang logis agar teknologi bantu (_screen reader_) dapat membaca konten dengan urutan yang benar.

## Konsistensi Penamaan (Figma to Code)

Salah satu sumber friksi terbesar dalam kolaborasi adalah perbedaan bahasa. Oleh karena itu, kita mewajibkan konsistensi penamaan yang ketat antara file desain Figma dan basis kode. Nama halaman atau frame di Figma harus merefleksikan nama rute atau file di folder `pages` React. Jika di Figma ada komponen bernama `PrimaryButton`, jangan menamainya `MainBtn` di kode; gunakan nama yang persis sama atau setidaknya pola yang sangat mirip seperti `Button` dengan varian `primary`.

Properti varian di Figma juga harus sinkron dengan props React. Hindari ambiguitas seperti Figma menggunakan istilah "Type" sementara kode menggunakan "Kind". Kesepakatan ini harus didokumentasikan dan dipatuhi. Tujuannya adalah agar ketika developer melihat desain, mereka bisa langsung membayangkan struktur komponen dan props yang perlu ditulis tanpa perlu menebak-nebak maksud desainer.

## Performa dan Maintainability

Kinerja aplikasi adalah bagian dari pengalaman pengguna. Desain yang efisien berkontribusi pada performa aplikasi. Kita harus mempertimbangkan biaya dari setiap aset yang digunakan; gambar harus dioptimalkan, ikon sebaiknya menggunakan format SVG yang ringan, dan variasi font yang tidak perlu harus dihindari untuk mengurangi waktu muat.

Dari sisi teknis, manfaatkan kemampuan Vite untuk _code splitting_ dan _lazy loading_. Komponen atau halaman yang berat dan jarang diakses sebaiknya tidak dimuat di awal (_initial load_). Prinsip _reusability_ juga berperan penting dalam maintainability; daripada membuat lima variasi kartu yang sedikit berbeda, buatlah satu komponen kartu yang fleksibel dengan props yang tepat. Kode yang lebih sedikit (DRY - _Don't Repeat Yourself_) berarti lebih sedikit bug dan lebih mudah untuk dipelihara. Optimasi ini harus menjadi pola pikir standar, bukan langkah perbaikan di akhir proyek.

## Penutup

Guidelines ini merangkum komitmen kita bersama untuk membangun aplikasi web yang unggul. Dengan struktur proyek yang jelas, standar penulisan kode React + TypeScript yang disiplin, Design System yang matang, pola UX yang empatik, serta perhatian mendalam pada aksesibilitas dan performa, kita meletakkan fondasi yang kuat untuk kesuksesan proyek.

Dokumen ini diharapkan menjadi referensi hidup yang dipatuhi oleh setiap anggota tim. Setiap piksel yang digambar di Figma dan setiap baris kode yang ditulis di Vite + React + TypeScript haruslah mencerminkan standar kualitas yang telah kita sepakati bersama di sini. Mari kita bangun produk yang tidak hanya berfungsi dengan baik, tetapi juga menyenangkan untuk dibangun dan digunakan.