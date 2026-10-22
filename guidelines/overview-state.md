# Overview State Management

## Pengantar

Manajemen state adalah tulang punggung interaktivitas aplikasi. Dalam arsitektur modern yang kita terapkan, kita membagi state menjadi dua kategori utama untuk menghindari *bloating* dan kompleksitas yang tidak perlu:

1.  **Server State**: Data yang berasal dari API backend (cache, loading status, error). Ini ditangani sepenuhnya oleh **TanStack Query** (lihat `overview-api.md`). Jangan simpan data API di global store kecuali benar-benar diperlukan lintas sesi.
2.  **Client State**: Data yang hidup di browser (UI toggle, form steps, session sementara). Ini ditangani oleh **Zustand** (default) atau **Rematch** (kompleks).

---

## 1. Zustand (Default Global State)

Zustand adalah pilihan utama kita untuk manajemen state global sisi klien. Sifatnya yang minimalis, berbasis hooks, dan tidak memerlukan *boilerplate* besar menjadikannya ideal untuk 90% kebutuhan aplikasi.

### Kapan Menggunakan Zustand?
- Menyimpan preferensi UI (Tema Light/Dark, Sidebar Open/Close).
- Menyimpan data sesi pengguna sementara (User Profile mini).
- Berbagi state antar komponen yang berjauhan tanpa *Prop Drilling*.

### Pola Implementasi

Setiap *store* harus fokus pada satu domain fitur (*Slice pattern*). Jangan membuat satu store raksasa (`useGlobalStore`); pecahlah menjadi store-store kecil yang spesifik.

**Lokasi File:** `src/store/use[Feature]Store.ts`

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// 1. Definisikan Interface State & Actions
interface UIState {
  isSidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

// 2. Buat Store dengan Middleware (Opsional)
// Middleware 'persist' otomatis menyimpan state ke localStorage
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // Initial State
        isSidebarOpen: true,
        theme: "light",

        // Actions
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: "ui-storage", // Key di localStorage
      }
    )
  )
);
```

**Penggunaan di Komponen:**

Gunakan selector granular untuk performa terbaik. Hindari mengambil seluruh objek state jika hanya butuh satu properti.

```typescript
// Good: Component hanya re-render jika 'isSidebarOpen' berubah
const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

// Bad: Component re-render setiap kali ada perubahan APAPUN di store
const { isSidebarOpen } = useUIStore(); 
```

---

## 2. Rematch (Complex State / Redux)

Rematch adalah pembungkus modern di atas Redux. Kita menggunakannya **HANYA** ketika logika bisnis klien menjadi sangat kompleks, melibatkan banyak sub-state yang saling bergantung, atau membutuhkan *time-travel debugging* yang ketat.

### Kapan Menggunakan Rematch?
- Aplikasi kasir/POS (Point of Sales) dengan logika keranjang belanja yang rumit (diskon, pajak, varian).
- Editor visual kompleks (seperti Canvas editor) dengan fitur Undo/Redo.
- State mesin (*State Machine*) yang rumit dengan banyak transisi.

### Struktur Models

Rematch mengorganisir kode berdasarkan "Models". Setiap model berisi `state`, `reducers` (sinkron), dan `effects` (asinkron).

**Lokasi File:** `src/store/rematch/models/[modelName].ts`

```typescript
import { createModel } from "@rematch/core";
import type { RootModel } from "."; // Import RootModel type

interface CartItem {
  id: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
}

export const cart = createModel<RootModel>()({
  state: {
    items: [],
    totalPrice: 0,
  } as CartState,

  // Reducers: Perubahan state sinkron (murni)
  reducers: {
    addItem(state, payload: CartItem) {
      const newItems = [...state.items, payload];
      return {
        ...state,
        items: newItems,
        totalPrice: newItems.reduce((acc, item) => acc + item.price * item.quantity, 0,
      };
    },
    removeItem(state, id: string) {
      return {
        ...state,
        items: state.items.filter((i) => i.id !== id),
      };
    },
  },

  // Effects: Side-effects (Async), bisa memanggil reducer lain
  effects: (dispatch) => ({
    async checkoutAsync(_payload, rootState) {
      // Akses state saat ini
      const { items } = rootState.cart;
      
      try {
        // Simulasi API call (sebaiknya gunakan React Query, tapi ini contoh logika bisnis)
        await api.processPayment(items);
        dispatch.cart.items([]); // Reset cart via reducer
      } catch (error) {
        console.error("Checkout failed");
      }
    },
  }),
});
```

**Setup Store (Root):**

File: `src/store/rematch/store.ts`

```typescript
import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { models, RootModel } from "./models";

export const store = init({
  models,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
```

---

## 3. Aturan Praktis (Rules of Thumb)

Untuk menjaga konsistensi, ikuti diagram keputusan ini saat menambahkan state baru:

1.  **Apakah data berasal dari API?**
    *   **YA** → Gunakan **React Query** (`useQuery`). Jangan simpan di Zustand/Redux.
2.  **Apakah state hanya dipakai di satu komponen?**
    *   **YA** → Gunakan `useState` atau `useReducer` lokal.
3.  **Apakah state dipakai di banyak komponen (Shared)?**
    *   **YA** → Apakah logikanya sederhana? (Toggle, Form sederhana)
        *   **YA** → Gunakan **Zustand**.
        *   **TIDAK** (Logika transaksional kompleks) → Gunakan **Rematch**.

### Ringkasan Tabel

| Fitur | React Query | Zustand | Rematch |
| :--- | :--- | :--- | :--- |
| **Data Source** | Server (API) | Client | Client |
| **Kompleksitas** | Tinggi (Async) | Rendah - Menengah | Sangat Tinggi |
| **Boilerplate** | Rendah | Sangat Rendah | Sedang |
| **Use Case** | List Produk, User Profile | Sidebar, Theme, Temp Form | Shopping Cart, Game State |
