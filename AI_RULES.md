# AI Rules for LearnXpert

This document describes the tech stack and coding conventions for the LearnXpert learning management system.

---

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins (figma asset resolution)
- **Routing**: React Router v7 (`createBrowserRouter`)
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite`
- **State Management**: Zustand for global state, TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts + custom DSChart component
- **Animation**: GSAP, Motion (Framer Motion), react-slick for carousels
- **Real-time**: Socket.io client for WebSocket connections
- **HTTP Client**: Axios with centralized interceptors
- **Utilities**: lodash, date-fns, clsx, tailwind-merge

---

## Library Usage Rules

### UI Components

1. **Use shadcn/ui components from `src/app/components/ui/` FIRST** — These are the latest version of shadcn/ui components built on Radix UI primitives with Tailwind CSS styling.

2. **Avoid creating new UI primitives** — The following components already exist and should be reused:
   - Layout: `card`, `sheet`, `dialog`, `drawer`, `sidebar`, `resizable`
   - Forms: `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `calendar`, `date-picker`
   - Navigation: `tabs`, `accordion`, `breadcrumb`, `navigation-menu`, `pagination`
   - Feedback: `alert`, `alert-dialog`, `toast` (sonner), `progress`, `skeleton`
   - Data Display: `table`, `badge`, `avatar`, `tooltip`, `hover-card`, `popover`
   - Overlay: `modal`, `dropdown-menu`, `context-menu`, `menubar`
   - Media: `carousel` (embla-based), `aspect-ratio`

3. **Class variance authority (cva)** is used for component variants — follow the existing pattern in `button.tsx` or `badge.tsx`.

4. **Use `cn()` utility for class merging** — Import from `src/app/components/ui/utils.ts` (or `@/lib/utils` for older code).

### Icons

- **Use `lucide-react` ONLY** — All icons should be imported from `lucide-react`
- Do NOT use other icon libraries (no `@mui/icons-material` for new code, no FontAwesome)

### Styling

- **Tailwind CSS v4** is used with the following conventions:
  - Use arbitrary values sparingly: `w-[100px]` only when necessary
  - Use the design system colors: `bg-primary`, `text-muted-foreground`, `border-border`
  - Spacing scale: Use standard Tailwind spacing (p-4, m-2, gap-6, etc.)
  - Dark mode is supported via CSS variables

### Forms & Validation

- **Form handling**: Use `react-hook-form` with `Controller` for controlled inputs
- **Validation**: Use Zod schemas with `@hookform/resolvers/zod`
- **Form UI**: Use the `Form` component from shadcn/ui which provides `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`

### Data Fetching

- **Server state**: Use TanStack Query (`useQuery`, `useMutation`)
  - Query keys should be typed and organized by feature
  - Stale time: 5 minutes, GC time: 10 minutes (configured in App.tsx)
- **HTTP client**: Use the centralized axios instance from `src/services/`
- **Mock data**: Use mock files in `data/*.mock.ts` for development

### State Management

- **Global state**: Zustand stores in `src/store/use[Feature]Store.ts`
- **Server state**: TanStack Query (don't put server data in Zustand)
- **Local state**: React `useState`, `useReducer` for component-level state

### Routing

- **Route definition**: All routes are defined in `src/routes/AppRoutes.tsx`
- **Protected routes**: Use `ProtectedRoute` component for authentication
- **Route parameters**: Use React Router's `useParams` hook
- **Navigation**: Use `useNavigate` for programmatic navigation

### Charts

- **Use Recharts** for data visualization
- **Use `DSChart`** component from `src/components/ui/ds-chart.tsx` for consistent styling
- Chart types available: BarChart, LineChart, AreaChart, PieChart, RadarChart

### Animations

- **Simple animations**: Use Tailwind transition classes
- **Complex animations**: Use `motion` (Framer Motion)
- **Scroll/GSAP**: Use GSAP for advanced scroll-triggered animations
- **Carousels**: Use `react-slick` or embla-carousel (via shadcn/ui carousel)

### Markdown Rendering

- Use `react-markdown` with plugins:
  - `remark-gfm` for GitHub Flavored Markdown
  - `remark-math` + `rehype-katex` for math equations
  - `rehype-highlight` for syntax highlighting
- Use the existing `MarkdownRenderer` component from `src/components/common/atoms/`

---

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Main app entry with providers
│   └── components/ui/       # shadcn/ui components (USE THESE)
├── components/
│   ├── ui/                  # Legacy UI components (migrate to app/components/ui/)
│   ├── common/              # Shared components across features
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── pages/
│   ├── auth/                # Authentication pages
│   ├── shared/              # Pages shared across roles (agenda, circle, resource)
│   ├── trainee/             # Trainee role pages
│   ├── hr/                  # HR role pages
│   ├── trainer/             # Trainer role pages
│   └── ld/                  # L&D team pages
│       └── [feature]/
│           ├── components/  # Feature-specific components
│           ├── hooks/       # Custom hooks
│           ├── data/        # Mock data, constants
│           ├── types/       # TypeScript types
│           └── page.tsx     # Main page component
├── routes/
│   ├── AppRoutes.tsx        # Route definitions
│   ├── AppLayout.tsx
│   └── ProtectedRoute.tsx
├── store/
│   └── use[Feature]Store.ts # Zustand stores
├── services/
│   └── [feature]Api.ts      # API services
├── hooks/
│   └── use[Feature].ts      # Shared custom hooks
├── lib/
│   └── utils.ts             # Utility functions (cn, etc.)
├── types/
│   └── [feature].types.ts   # Shared types
└── styles/
    ├── design-system.css    # Design tokens
    ├── theme.css            # Theme variables
    └── tailwind.css         # Tailwind imports
```

---

## Coding Conventions

### TypeScript

- Use strict TypeScript with explicit return types on exported functions
- Define types in `types/*.types.ts` files
- Use interfaces for object shapes, types for unions/intersections
- Avoid `any` — use `unknown` with type guards if necessary

### Naming

- **Components**: PascalCase (`UserProfileCard.tsx`)
- **Hooks**: camelCase starting with `use` (`useUserData.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types/Interfaces**: PascalCase with descriptive names (`UserProfile`, `CourseModule`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for config objects

### File Organization

- One component per file (except small related components)
- Co-locate related files: component, styles, tests, stories in same directory
- Use barrel exports (`index.ts`) for clean imports from feature folders

### Imports

- Use path aliases: `@/components`, `@/pages`, `@/store`, `@/lib/utils`
- Order: React → Third-party → Absolute imports → Relative imports → Types
- Group and separate with newlines

### Error Handling

- Use Error Boundaries for component tree errors
- Use Zod for runtime validation of external data
- Handle loading and error states in components using TanStack Query's `isLoading`, `isError` states

### Performance

- Use `React.memo` for expensive renders
- Use `useMemo` for expensive computations
- Use `useCallback` for stable callbacks passed to children
- Lazy load routes and heavy components
- Optimize images with the figma asset plugin

---

## AI-Assisted Development Guidelines

1. **Always check existing components first** — Search `src/components/` and `src/app/components/ui/` before creating new UI components.

2. **Follow the existing pattern** — Look at similar pages/features for code structure and naming conventions.

3. **Use TypeScript strictly** — Add proper types for all props, state, and function returns.

4. **Respect the folder structure** — Place new features in the correct role folder (`trainee/`, `hr/`, `trainer/`, `ld/`).

5. **Add mock data** — Create mock data files in `data/*.mock.ts` for new features.

6. **Register routes** — Add new routes to `src/routes/AppRoutes.tsx` following the existing pattern.

7. **Use existing hooks** — Check `src/hooks/` for reusable logic before creating new hooks.

8. **Test with mock data** — Features should work with mock data before API integration.

---

## Dependencies to Avoid

- **UI Libraries**: Do NOT add Material-UI, Ant Design, or Chakra UI (use shadcn/ui)
- **State Management**: Do NOT add Redux, MobX, or Recoil (use Zustand + TanStack Query)
- **Form Libraries**: Do NOT add Formik (use React Hook Form)
- **CSS Libraries**: Do NOT add styled-components or emotion (use Tailwind CSS)
- **Date Libraries**: Do NOT add moment.js (use date-fns)
- **HTTP Clients**: Do NOT add fetch wrappers beyond axios
