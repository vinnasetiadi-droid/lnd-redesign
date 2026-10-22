# Overview Middleware Architecture

## Pengantar

Dokumen ini menjelaskan arsitektur middleware sederhana yang **OPSIONAL** digunakan dalam aplikasi. Middleware digunakan untuk mengatur akses user dan mengintegrasikan dengan axios interceptor untuk handle 401 (unauthorized).

**PENTING**: Middleware **HANYA DIPERLUKAN** untuk aplikasi yang memiliki:

- Login/Register flow
- Dashboard dengan sidebar
- Protected routes yang memerlukan authentication

Untuk aplikasi sederhana seperti **company profile** atau **landing page** yang tidak memerlukan authentication, middleware **TIDAK PERLU** diimplementasikan.

**Prinsip Dasar:**

- **Simple & Focused**: Middleware sederhana untuk cek akses user
- **Axios Integration**: Terintegrasi dengan axios interceptor untuk handle 401
- **Sidebar Control**: Mengatur sidebar berdasarkan akses user
- **Type Safety**: Semua middleware harus fully typed dengan TypeScript
- **Dummy Login untuk Development**: Jika API belum tersedia, buat dummy login yang penting bisa redirect by middleware

---

## 1. Struktur Folder Middleware

```
src/
├── middleware/
│   ├── auth.middleware.ts          # Authentication middleware untuk route
│   └── types.ts                    # Type definitions untuk middleware
├── store/
│   └── useAuthStore.ts             # Zustand store untuk user data
├── services/
│   └── api.ts                      # Axios instance dengan interceptor
├── hooks/
│   ├── useAuth.ts                  # Auth hook untuk cek akses
│   ├── useLogin.ts                 # Login hook untuk menyimpan user data
│   └── useRouteGuard.ts            # Route protection hook
└── components/
    └── layout/
        └── Sidebar.tsx             # Sidebar dengan middleware akses
```

---

## 2. Axios Interceptor untuk Handle 401 - **WAJIB**

**WAJIB**: Setup axios interceptor untuk handle 401 (unauthorized) secara otomatis.

### 2.1. Axios Instance dengan Interceptor

```typescript
// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken } from "@/utils/token";
import { useAuthStore } from "@/store/useAuthStore";

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear token
      removeToken();

      // Clear user data dari store
      useAuthStore.getState().logout();

      // Redirect ke login
      if (window.location.pathname !== "/login") {
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`;
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 2.2. Utility Functions untuk Token

```typescript
// src/utils/token.ts
const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function hasToken(): boolean {
  return !!getToken();
}
```

---

## 3. Route Middleware untuk SPA - **WAJIB**

**PENTING**: Untuk Single Page Application (SPA), route protection dilakukan di **router configuration** menggunakan component wrapper (`ProtectedRoute`), bukan di dalam component. Protection dilakukan di layout level sehingga semua children routes otomatis protected.

**WAJIB**: Route protection dilakukan di router, bukan di component. Component pages **TIDAK PERLU** menggunakan `useRouteGuard` hook.

### 3.1. Protected Route Component (Wrapper) - **WAJIB**

**WAJIB**: Gunakan `ProtectedRoute` component wrapper di router configuration untuk route protection.

Jika ingin menggunakan wrapper component untuk route protection:

```typescript
// src/components/middleware/ProtectedRoute.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasToken } from "@/utils/token";
import { PageLoader } from "@/components/common/PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = false,
  requireGuest = false,
  redirectTo,
}: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !hasToken()) {
      const currentPath = window.location.pathname;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, {
        replace: true,
      });
      return;
    }

    if (requireGuest && hasToken()) {
      navigate(redirectTo || "/dashboard", { replace: true });
      return;
    }
  }, [requireAuth, requireGuest, navigate, redirectTo]);

  // Show loading while checking
  if (requireAuth && !hasToken()) {
    return <PageLoader />;
  }

  if (requireGuest && hasToken()) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
```

**Penggunaan di Router Configuration - Layout Level Protection:**

**WAJIB**: Route protection dilakukan di **layout level**, bukan di setiap route individual. Dengan wrap layout dengan `ProtectedRoute`, semua children routes otomatis protected.

```typescript
// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/middleware/ProtectedRoute";
import { PageLoader } from "@/components/common/PageLoader";
import { AuthLayout } from "@/layouts/AuthLayout";
import { GuestLayout } from "@/layouts/GuestLayout";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const UserListPage = lazy(() => import("@/pages/users/page"));
const UserDetailPage = lazy(() => import("@/pages/users/DetailPage"));
const UserFormPage = lazy(() => import("@/pages/users/FormPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Guest Routes (Public) - Tanpa Protection */}
      <Route element={<GuestLayout />}>
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<PageLoader />}>
              <RegisterPage />
            </Suspense>
          }
        />
      </Route>

      {/* Auth Routes (Protected) - Protection di Layout Level */}
      {/* Semua children routes otomatis protected karena parent layout protected */}
      <Route
        element={
          <ProtectedRoute requireAuth>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/users"
          element={
            <Suspense fallback={<PageLoader />}>
              <UserListPage />
            </Suspense>
          }
        />
        <Route
          path="/users/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <UserDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/users/:id/form"
          element={
            <Suspense fallback={<PageLoader />}>
              <UserFormPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};
```

**Catatan Penting:**

- Protection dilakukan di layout level, bukan di setiap route individual
- Semua children routes di dalam layout yang di-wrap dengan `ProtectedRoute` otomatis protected
- Component pages **TIDAK PERLU** menggunakan `useRouteGuard` hook

---

## 4. Auth Store untuk Menyimpan Data User - **WAJIB**

**WAJIB**: Gunakan Zustand store untuk menyimpan data user setelah login.

### 4.1. Auth Store dengan Zustand

```typescript
// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setToken, removeToken } from "@/utils/token";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // Login: Simpan user data dan token
      login: (user: User, token: string) => {
        setToken(token);
        set({
          user,
          isAuthenticated: true,
        });
      },

      // Logout: Clear user data dan token
      logout: () => {
        removeToken();
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      // Update user data (untuk update profile, dll)
      updateUser: (updatedUser: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },
    }),
    {
      name: "auth-storage", // Key untuk localStorage
      partialize: (state) => ({ user: state.user }), // Hanya simpan user, tidak simpan isAuthenticated
    }
  )
);
```

### 4.2. Update Axios Interceptor untuk Clear User Data

```typescript
// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken } from "@/utils/token";
import { useAuthStore } from "@/store/useAuthStore";

// ... axios instance setup ...

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear token
      removeToken();

      // Clear user data dari store
      useAuthStore.getState().logout();

      // Redirect ke login
      if (window.location.pathname !== "/login") {
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`;
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
```

### 4.3. Login Hook/Function

```typescript
// src/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/services/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    permissions?: string[];
  };
  token: string;
}

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<LoginResponse> => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Simpan user data dan token ke store
      login(data.user, data.token);

      // Redirect ke dashboard atau redirect URL
      const redirectUrl = new URLSearchParams(window.location.search).get(
        "redirect"
      );
      navigate(redirectUrl || "/dashboard", { replace: true });
    },
    onError: (error) => {
      // Error handling (axios interceptor tidak akan trigger karena ini bukan 401)
      console.error("Login failed:", error);
    },
  });
}
```

### 4.4. Dummy Login untuk Development (Jika API Belum Tersedia)

**PENTING**: Jika API backend belum tersedia, buat dummy login yang penting bisa redirect by middleware untuk testing route protection.

```typescript
// src/hooks/useLogin.ts (Dummy Version untuk Development)
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { setToken } from "@/utils/token";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Simulasi delay API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dummy validation (untuk development saja)
      if (credentials.email && credentials.password) {
        // Dummy user data
        const dummyUser = {
          id: "1",
          name: "Dummy User",
          email: credentials.email,
          role: "admin",
          permissions: ["read", "write"],
        };

        // Dummy token
        const dummyToken = "dummy-jwt-token-" + Date.now();

        return {
          user: dummyUser,
          token: dummyToken,
        };
      }

      throw new Error("Invalid credentials");
    },
    onSuccess: (data) => {
      // Simpan token ke localStorage
      setToken(data.token);

      // Simpan user data ke store
      login(data.user, data.token);

      // Redirect ke dashboard atau redirect URL
      const redirectUrl = new URLSearchParams(window.location.search).get(
        "redirect"
      );
      navigate(redirectUrl || "/dashboard", { replace: true });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Tampilkan error message ke user
    },
  });
}
```

**Catatan**:

- Ganti dengan implementasi real API ketika backend sudah tersedia
- Dummy login ini hanya untuk testing middleware dan redirect functionality
- Pastikan untuk menghapus dummy login sebelum production

### 4.5. Penggunaan Login Hook

```typescript
// src/pages/auth/LoginPage.tsx
import { useLogin } from "@/hooks/useLogin";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/TextField";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export function LoginPage() {
  const loginMutation = useLogin();
  const methods = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <TextField name="email" label="Email" type="email" />
        <TextField name="password" label="Password" type="password" />

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </FormProvider>
  );
}
```

### 4.6. Auth Hook untuk Cek Akses

```typescript
// src/hooks/useAuth.ts
import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { hasToken } from "@/utils/token";

export function useAuth() {
  const { user, isAuthenticated: storeIsAuthenticated } = useAuthStore();

  const isAuthenticated = useMemo(() => {
    return hasToken() && !!user && storeIsAuthenticated;
  }, [user, storeIsAuthenticated]);

  const hasAccess = useMemo(() => {
    // Cek apakah user punya akses berdasarkan role atau permission
    if (!user) return false;

    // Contoh: cek role
    // return user.role === "admin" || user.role === "user";

    // Contoh: cek permission
    // return user.permissions?.includes("access:app") || false;

    // Untuk sekarang, cukup cek authenticated
    return isAuthenticated;
  }, [user, isAuthenticated]);

  return {
    isAuthenticated,
    hasAccess,
    user,
    logout: useAuthStore((state) => state.logout),
    updateUser: useAuthStore((state) => state.updateUser),
  };
}
```

### 4.7. Logout Function

```typescript
// src/components/layout/Header.tsx
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear user data dan token dari store
    navigate("/login", { replace: true });
  };

  return (
    <header>
      <div>Welcome, {user?.name}</div>
      <Button onClick={handleLogout}>Logout</Button>
    </header>
  );
}
```

---

## 5. Sidebar dengan Middleware Akses - **WAJIB**

Sidebar yang menampilkan item berdasarkan akses user.

### 5.1. Sidebar Component dengan Akses Control

```typescript
// src/components/layout/Sidebar.tsx
import { useAuth } from "@/hooks/useAuth";
import { SidebarItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarMenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean; // true = hanya muncul jika authenticated
  requiresAccess?: boolean; // true = hanya muncul jika hasAccess
}

const sidebarMenuItems: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    requiresAuth: true,
  },
  {
    label: "Users",
    href: "/users",
    requiresAuth: true,
    requiresAccess: true, // Hanya muncul jika user punya akses
  },
  {
    label: "Settings",
    href: "/settings",
    requiresAuth: true,
  },
];

export function Sidebar() {
  const { isAuthenticated, hasAccess } = useAuth();

  const visibleItems = sidebarMenuItems.filter((item) => {
    // Filter berdasarkan auth dan access
    if (item.requiresAuth && !isAuthenticated) return false;
    if (item.requiresAccess && !hasAccess) return false;
    return true;
  });

  return (
    <aside className="sidebar">
      {visibleItems.map((item) => (
        <SidebarItem key={item.href} href={item.href}>
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </SidebarItem>
      ))}
    </aside>
  );
}
```

### 5.2. Alternatif: Sidebar dengan Role-based Access

Jika menggunakan role-based access:

```typescript
// src/components/layout/Sidebar.tsx
import { useAuth } from "@/hooks/useAuth";
import { SidebarItem } from "@/components/ui/sidebar";

interface SidebarMenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  allowedRoles?: string[]; // Role yang diizinkan akses
}

const sidebarMenuItems: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Users",
    href: "/users",
    allowedRoles: ["admin", "manager"], // Hanya admin dan manager
  },
  {
    label: "Admin Panel",
    href: "/admin",
    allowedRoles: ["admin"], // Hanya admin
  },
];

export function Sidebar() {
  const { user } = useAuth();

  const visibleItems = sidebarMenuItems.filter((item) => {
    // Jika tidak ada allowedRoles, semua bisa akses
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true;
    }

    // Cek apakah user role ada di allowedRoles
    return user?.role && item.allowedRoles.includes(user.role);
  });

  return (
    <aside className="sidebar">
      {visibleItems.map((item) => (
        <SidebarItem key={item.href} href={item.href}>
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </SidebarItem>
      ))}
    </aside>
  );
}
```

---

## 6. Best Practices

### 6.1. Axios Interceptor Setup

**WAJIB**: Setup axios interceptor di awal aplikasi:

```typescript
// src/main.tsx atau src/services/api.ts
import { api } from "@/services/api";

// Pastikan interceptor sudah terpasang sebelum app start
```

### 6.2. Token Management

**WAJIB**: Gunakan utility functions untuk token, jangan akses localStorage langsung:

```typescript
// ✅ GOOD
import { getToken, setToken, removeToken } from "@/utils/token";
const token = getToken();

// ❌ BAD
const token = localStorage.getItem("auth_token"); // Hardcoded
```

### 6.3. Sidebar Menu Configuration

**WAJIB**: Definisikan sidebar menu items di satu tempat untuk mudah di-maintain:

```typescript
// ✅ GOOD - Centralized config
const sidebarMenuItems: SidebarMenuItem[] = [
  { label: "Dashboard", href: "/dashboard", requiresAuth: true },
  // ...
];

// ❌ BAD - Hardcoded di component
<SidebarItem href="/dashboard">Dashboard</SidebarItem>;
```

### 6.4. Error Handling

**WAJIB**: Axios interceptor sudah handle 401, tapi pastikan error handling di API calls juga proper:

```typescript
// ✅ GOOD
try {
  const response = await api.get("/users");
  return response.data;
} catch (error) {
  // Axios interceptor sudah handle 401
  // Handle error lainnya di sini
  console.error("Failed to fetch users:", error);
  throw error;
}
```

---

## 7. Checklist Implementasi Middleware

**PENTING**: Checklist ini **HANYA DIPERLUKAN** untuk aplikasi yang memiliki authentication flow (login/register, dashboard dengan sidebar). Untuk aplikasi sederhana seperti company profile atau landing page, checklist ini **TIDAK PERLU** diimplementasikan.

Saat setup middleware untuk SPA, pastikan:

- [ ] **Keputusan**: Sudah menentukan apakah aplikasi memerlukan middleware (hanya untuk aplikasi dengan auth)
- [ ] **Auth Store**: `useAuthStore` sudah dibuat dengan Zustand untuk menyimpan user data
- [ ] **Login Hook**: `useLogin` hook sudah dibuat untuk handle login dan menyimpan user data ke store
- [ ] **Dummy Login (Opsional)**: Jika API belum tersedia, dummy login sudah dibuat untuk testing middleware dan redirect functionality
- [ ] **Token Management**: Token utility functions sudah dibuat (`getToken`, `setToken`, `removeToken`)
- [ ] **Axios Interceptor**: Sudah setup untuk handle 401 dan clear user data dari store
- [ ] **Auth Hook**: `useAuth` hook sudah dibuat untuk cek akses dari store
- [ ] **Protected Route Component**: `ProtectedRoute` component sudah dibuat untuk route protection
- [ ] **Route Protection di Router**: Route protection dilakukan di router configuration (layout level), bukan di component
- [ ] **Component Pages**: Component pages TIDAK menggunakan `useRouteGuard` hook (protection sudah di router)
- [ ] **Sidebar**: Sidebar sudah menggunakan middleware untuk filter menu items berdasarkan user data
- [ ] **Logout**: Logout function sudah clear user data dari store dan token
- [ ] **Type Safety**: Semua middleware fully typed dengan TypeScript
- [ ] **Error Handling**: Error handling sudah ditangani dengan baik
- [ ] **Auto Redirect**: Axios interceptor handle 401 secara otomatis (tidak perlu manual redirect di setiap page)

---

Dengan mengikuti arsitektur middleware sederhana ini, kita memastikan kontrol akses yang konsisten dan terintegrasi dengan axios interceptor untuk handle 401 secara otomatis.
