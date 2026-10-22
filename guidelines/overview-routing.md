# Overview Routing Patterns & CRUD Structure

## Pengantar

Dokumen ini menjelaskan standar pola routing yang **WAJIB** digunakan untuk operasi CRUD (Create, Read, Update, Delete) dalam aplikasi. Pola ini memastikan konsistensi struktur routing, memudahkan navigasi, dan mempermudah maintenance kode.

**Referensi**: Guidelines ini untuk **Single Page Application (SPA)** menggunakan React Router. Pastikan untuk mengacu ke dokumentasi resmi React Router untuk detail implementasi yang lebih lengkap.

**Catatan Penting**: Middleware untuk route protection **TIDAK SELALU DIPERLUKAN**. Middleware hanya diperlukan untuk aplikasi yang memiliki:

- Login/Register flow
- Dashboard dengan sidebar
- Protected routes yang memerlukan authentication

Untuk aplikasi sederhana seperti **company profile** atau **landing page** yang tidak memerlukan authentication, middleware **TIDAK PERLU** diimplementasikan.

---

## 0. Prinsip Dasar Routing - **WAJIB**

Sebelum membuat routes, pastikan mengikuti prinsip berikut:

1. **Lazy Loading**: **WAJIB** menggunakan `lazy()` untuk semua pages untuk optimasi bundle size
2. **Layout Grouping**: **WAJIB** mengelompokkan routes berdasarkan layout (AuthLayout untuk protected routes, GuestLayout untuk public routes)
3. **Route Protection (Opsional)**: Hanya untuk aplikasi dengan authentication. Gunakan component wrapper (`ProtectedRoute`) di router configuration untuk route protection, bukan di dalam component
4. **Suspense untuk Loading**: **WAJIB** menggunakan Suspense dengan fallback yang konsisten (PageLoader)

---

## 1. Standar Struktur Routing untuk CRUD - **WAJIB**

Untuk operasi CRUD, **WAJIB** menggunakan pola routing yang konsisten dengan format berikut:

### Struktur Folder dan File

```
src/
├── pages/
│   └── [feature]/
│       ├── index.tsx          # List/Index page
│       ├── [id].tsx           # Detail page
│       └── [id]/
│           └── form.tsx        # Form page (Create & Edit)
```

### Pola URL

- **List/Index**: `/[feature]` → `/[feature]/index.tsx` atau `/[feature].tsx`
- **Detail**: `/[feature]/:id` → `/[feature]/[id].tsx` atau `/[feature]/[id]/index.tsx`
- **Form (Create/Edit)**: `/[feature]/:id/form` → `/[feature]/[id]/form.tsx`

**Catatan**: Satu file `form.tsx` digunakan untuk **create** dan **edit**. Gunakan query parameter atau state untuk membedakan mode.

---

## 2. Contoh Implementasi

### Contoh: User Management CRUD

**Struktur Folder:**

```
src/pages/users/
├── index.tsx          # UserListPage - /users
├── [id].tsx           # UserDetailPage - /users/:id
└── [id]/
    └── form.tsx       # UserFormPage - /users/:id/form
```

**Routing Configuration (`src/routes/AppRoutes.tsx`):**

```typescript
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PageLoader } from "@/components/common/PageLoader";

// Lazy load untuk performa - WAJIB untuk semua pages
const UserListPage = lazy(() => import("@/pages/users/index"));
const UserDetailPage = lazy(() => import("@/pages/users/[id]"));
const UserFormPage = lazy(() => import("@/pages/users/[id]/form"));

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes (Protected) - Group dengan AuthLayout */}
      <Route element={<AuthLayout />}>
        {/* User CRUD Routes */}
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

- **WAJIB**: Semua pages harus di-lazy load untuk optimasi bundle size
- **WAJIB**: Group routes berdasarkan layout (AuthLayout untuk protected routes, GuestLayout untuk public routes)
- **WAJIB**: Route protection dilakukan di router configuration menggunakan `ProtectedRoute` wrapper, bukan di dalam component

**List Page (`src/pages/users/index.tsx`):**

```typescript
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/features/users/components/UserTable";

export function UserListPage() {
  const navigate = useNavigate();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const handleCreate = () => {
    navigate("/users/new/form");
  };

  const handleView = (id: string) => {
    navigate(`/users/${id}`);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={handleCreate}>Create User</Button>
      </div>
      <UserTable users={users} onView={handleView} />
    </div>
  );
}
```

**Detail Page (`src/pages/users/[id].tsx`):**

```typescript
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { UserDetail } from "@/features/users/components/UserDetail";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id!),
    enabled: !!id,
  });

  const handleEdit = () => {
    navigate(`/users/${id}/form`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Detail</h1>
        <Button onClick={handleEdit}>Edit</Button>
      </div>
      <UserDetail user={user} />
    </div>
  );
}
```

**Form Page dengan React Hook Form - Struktur Rapi:**

**1. Schema Validasi Terpusat (`src/schemas/userForm.ts`):**

```typescript
import * as yup from "yup";

// Schema untuk alamat (sub-form)
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

**2. Komponen Input Terisolasi (`src/components/form/TextField.tsx`):**

```typescript
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

**3. Form Page (`src/pages/users/[id]/form.tsx`):**

```typescript
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/TextField";
import { userFormSchema, UserFormData } from "@/schemas/userForm";

export function UserFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Tentukan mode: create atau edit
  const isEditMode = id && id !== "new";

  // Fetch data hanya jika edit mode
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id!),
    enabled: isEditMode,
  });

  // Mutation untuk create atau update
  const mutation = useMutation({
    mutationFn: (data: UserFormData) =>
      isEditMode ? updateUser(id!, data) : createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
  });

  // Form setup dengan react-hook-form
  const methods = useForm<UserFormData>({
    resolver: yupResolver(userFormSchema),
    defaultValues: user || {
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

  const onSubmit = async (data: UserFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit User" : "Create User"}
      </h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <TextField name="name" label="Full Name" />
          <TextField name="email" label="Email" type="email" />

          {/* Nested object example */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Address</h3>
            <TextField name="address.street" label="Street" />
            <TextField name="address.city" label="City" />
            <TextField name="address.zipCode" label="ZIP Code" />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={methods.formState.isSubmitting || mutation.isPending}
            >
              {methods.formState.isSubmitting || mutation.isPending
                ? "Saving..."
                : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/users")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
```

**Catatan Penting:**

- **WAJIB**: Schema validasi diletakkan di file terpisah (`src/schemas/`) dan dikelompokkan dengan rapi
- **WAJIB**: Komponen input dibuat terisolasi dan reusable menggunakan `useFormContext`
- **WAJIB**: Menggunakan `FormProvider` untuk menyediakan form context ke child components
- **WAJIB**: Menggunakan `methods.handleSubmit()` dari react-hook-form (bukan manual preventDefault)
- **WAJIB**: Validasi menggunakan Yup dengan `yupResolver` untuk type safety

---

## 3. Best Practices Routing

### 3.1. Gunakan useQuery untuk Data Fetching

Selalu gunakan `@tanstack/react-query` (useQuery) untuk fetching data, bukan useEffect manual:

```typescript
// ❌ BAD
useEffect(() => {
  fetchUser(id).then(setUser);
}, [id]);

// ✅ GOOD
const { data: user } = useQuery({
  queryKey: ["user", id],
  queryFn: () => fetchUser(id!),
  enabled: !!id,
});
```

### 3.2. Conditional Fetching dengan `enabled`

Gunakan `enabled` option untuk conditional fetching:

```typescript
// Hanya fetch jika id tersedia dan bukan 'new'
const { data } = useQuery({
  queryKey: ["user", id],
  queryFn: () => fetchUser(id!),
  enabled: isEditMode && !!id,
});
```

### 3.3. Navigation Pattern

Gunakan `useNavigate` untuk navigasi programmatic:

```typescript
// Navigate ke create form
navigate("/users/new/form");

// Navigate ke edit form
navigate(`/users/${id}/form`);

// Navigate ke detail
navigate(`/users/${id}`);

// Navigate back
navigate(-1);
```

### 3.4. Query Invalidation

Invalidate query setelah mutation untuk refresh data:

```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    // Invalidate list query
    queryClient.invalidateQueries({ queryKey: ["users"] });
    // Invalidate specific item query
    queryClient.invalidateQueries({ queryKey: ["user", id] });
    navigate("/users");
  },
});
```

### 3.5. Route Protection untuk SPA - **OPSIONAL**

**PENTING**: Route protection **HANYA DIPERLUKAN** untuk aplikasi yang memiliki authentication flow (login/register, dashboard dengan sidebar). Untuk aplikasi sederhana seperti company profile atau landing page, section ini **TIDAK PERLU** diimplementasikan.

**Kapan Route Protection Diperlukan:**

- ✅ Aplikasi dengan login/register
- ✅ Dashboard dengan sidebar yang memerlukan authentication
- ✅ Protected routes yang hanya bisa diakses setelah login

**Kapan Route Protection TIDAK Diperlukan:**

- ❌ Company profile website
- ❌ Landing page
- ❌ Public website tanpa authentication

**Jika Diperlukan**: Untuk Single Page Application (SPA), gunakan component wrapper (`ProtectedRoute`) di router configuration untuk route protection, bukan di dalam component.

**WAJIB**: Route protection dilakukan di **router configuration**, bukan di dalam component. Ini memastikan protection berjalan sebelum component di-render.

**Referensi Lengkap**: Lihat [Overview Middleware Architecture](./overview-middleware.md) untuk dokumentasi lengkap tentang middleware system, termasuk middleware untuk button, page, sidebar, dan lainnya.

**Implementasi di Router Configuration - Protection di Layout Level:**

**WAJIB**: Route protection dilakukan di **layout level**, bukan di setiap route individual. Dengan wrap layout dengan `ProtectedRoute`, semua children routes otomatis protected.

```typescript
// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { GuestLayout } from "@/layouts/GuestLayout";
import { ProtectedRoute } from "@/components/middleware/ProtectedRoute";
import { PageLoader } from "@/components/common/PageLoader";

// Lazy load pages
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const UserListPage = lazy(() => import("@/pages/users/index"));
const UserDetailPage = lazy(() => import("@/pages/users/[id]"));
const UserFormPage = lazy(() => import("@/pages/users/[id]/form"));

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

**Keuntungan Protection di Layout Level:**

- ✅ Semua children routes otomatis protected (tidak perlu wrap setiap route)
- ✅ Lebih maintainable dan DRY (Don't Repeat Yourself)
- ✅ Mudah menambah route baru tanpa perlu wrap lagi
- ✅ Konsisten dengan grouping routes berdasarkan layout

**Component Pages TIDAK Perlu useRouteGuard:**

```typescript
// src/pages/users/index.tsx (UserListPage)
import { useQuery } from "@tanstack/react-query";

export function UserListPage() {
  // TIDAK perlu useRouteGuard di sini
  // Protection sudah dilakukan di router

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  // Component implementation
}
```

**Detail Implementasi**: Lihat section "Route Middleware untuk SPA" di [Overview Middleware Architecture](./overview-middleware.md) untuk implementasi lengkap `ProtectedRoute` component.

### 3.6. Route Grouping dengan Layout - **WAJIB**

**WAJIB**: Group routes berdasarkan layout (auth dan non-auth) untuk konsistensi dan maintainability.

**Struktur Layout:**

```typescript
// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export function AuthLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// src/layouts/GuestLayout.tsx
import { Outlet } from "react-router-dom";

export function GuestLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
```

**Catatan Penting:**

- Route protection dilakukan di **layout level** di router configuration, bukan di component
- Semua children routes di dalam layout yang di-wrap dengan `ProtectedRoute` otomatis protected
- Tidak perlu wrap setiap route individual - cukup wrap layout sekali
- Component pages **TIDAK PERLU** menggunakan `useRouteGuard` hook

**Detail Implementasi**: Lihat section "Route Middleware untuk SPA" di [Overview Middleware Architecture](./overview-middleware.md) untuk implementasi lengkap `ProtectedRoute` component.

### 3.7. Error Boundaries untuk Route

Gunakan Error Boundary untuk menangkap error di level route:

```typescript
// src/components/common/ErrorBoundary.tsx
import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Penggunaan di AppRoutes.tsx
<Route
  path="/users"
  element={
    <ErrorBoundary>
      <UserListPage />
    </ErrorBoundary>
  }
/>;
```

### 3.8. Loading States dengan Suspense

Gunakan Suspense untuk lazy loading dengan fallback yang konsisten:

```typescript
// src/components/common/PageLoader.tsx
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Penggunaan di AppRoutes.tsx
<Route
  path="/users"
  element={
    <Suspense fallback={<PageLoader />}>
      <UserListPage />
    </Suspense>
  }
/>;
```

### 3.9. URL Search Params Management

Gunakan URL search params untuk filter, pagination, dan sorting:

```typescript
import { useSearchParams } from "react-router-dom";

export function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  const { data } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => fetchUsers({ page, search }),
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), search });
  };

  const handleSearch = (value: string) => {
    setSearchParams({ page: "1", search: value });
  };

  return (
    <div>
      <input
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search users..."
      />
      {/* ... */}
    </div>
  );
}
```

### 3.10. Route-based Code Splitting

Gunakan lazy loading untuk semua route untuk optimasi bundle size:

```typescript
// ✅ GOOD - Lazy load semua pages
const UserListPage = lazy(() => import("@/pages/users/index"));
const UserDetailPage = lazy(() => import("@/pages/users/[id]"));
const UserFormPage = lazy(() => import("@/pages/users/[id]/form"));

// ❌ BAD - Import langsung (akan masuk ke initial bundle)
import { UserListPage } from "@/pages/users/index";
```

### 3.11. Not Found (404) Handling

Selalu sediakan route catch-all untuk 404:

```typescript
// Di AppRoutes.tsx
<Route
  path="*"
  element={
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <Button onClick={() => navigate("/")}>Go Home</Button>
    </div>
  }
/>
```

### 3.12. Route Naming Convention

Gunakan naming convention yang konsisten untuk route paths:

```typescript
// ✅ GOOD - Konsisten dan jelas
/users              // List
/users/:id          // Detail
/users/:id/form     // Form
/users/:id/settings // Nested feature

// ❌ BAD - Tidak konsisten
/user-list
/user-detail/:id
/user-form/:id
```

---

## 4. Pola Alternatif (Jika Diperlukan)

Jika struktur routing di atas tidak sesuai dengan kebutuhan spesifik, pastikan untuk:

1. Mendokumentasikan alasan deviasi
2. Tetap mengikuti prinsip konsistensi
3. Memastikan pola yang digunakan mudah dipahami oleh tim

---

## 4. React Version Requirement

**WAJIB**: Gunakan React versi stable (React 18 atau lebih baru). Jangan gunakan React 14 atau 15.

```json
// package.json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

React 18+ menyediakan:

- Concurrent features (Suspense, useTransition)
- Automatic batching
- Improved performance
- Better TypeScript support

---

## 5. Checklist Implementasi CRUD

Saat membuat fitur CRUD baru, pastikan:

- [ ] Struktur folder mengikuti pola: `index.tsx`, `[id].tsx`, `[id]/form.tsx`
- [ ] **WAJIB**: Lazy loading digunakan untuk semua pages (`lazy(() => import(...))`)
- [ ] **WAJIB**: Routes di-group berdasarkan layout (AuthLayout untuk protected, GuestLayout untuk public)
- [ ] **OPSIONAL**: Route protection hanya diperlukan untuk aplikasi dengan authentication. Jika diperlukan, gunakan `ProtectedRoute` wrapper di router configuration
- [ ] Route protection dilakukan di router, bukan di dalam component (component pages TIDAK perlu useRouteGuard)
- [ ] Jika API belum tersedia, dummy login sudah dibuat untuk testing middleware dan redirect functionality
- [ ] Routing configuration sudah ditambahkan di `AppRoutes.tsx` dengan layout grouping
- [ ] Error Boundary membungkus route untuk error handling
- [ ] List page menggunakan `useQuery` untuk fetch data
- [ ] Detail page menggunakan `useQuery` dengan `enabled` conditional
- [ ] Form page mendeteksi mode (create/edit) dengan `id !== 'new'`
- [ ] Form page menggunakan `useMutation` untuk create/update
- [ ] Query invalidation dilakukan setelah mutation success
- [ ] Navigation menggunakan `useNavigate` dengan path yang konsisten
- [ ] Loading states ditangani dengan baik (Suspense fallback dengan PageLoader)
- [ ] Error states ditangani dengan baik (Error Boundary)
- [ ] URL search params digunakan untuk filter/pagination jika diperlukan
- [ ] 404 route (catch-all) sudah ditambahkan

---

Dengan mengikuti pola routing ini, kita memastikan konsistensi struktur aplikasi dan memudahkan maintenance serta kolaborasi tim.
