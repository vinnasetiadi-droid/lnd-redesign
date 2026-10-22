# LX Admin — 3 pages (copy)

Standalone copy of three Admin (L&D) pages from **lnd-presight-demo**, branch
`vinna/lnd-admin-instructure` at commit `7b72a3e51` (same as what is deployed on Vercel).
It is a plain folder, not a git repo, so nothing here can be pushed to GitHub/Vercel.

| Page | Route | Source folder |
|---|---|---|
| Home Admin | `/ld/dashboard` | `src/pages/ld/dashboard/` |
| Analytics › Learning Program | `/ld/analytics/course` | `src/pages/ld/analytics/course/` |
| Program Management › Upskill | `/ld/learning-management/courses` | `src/pages/ld/learning_management/courses/` |

### Design options

`/` is a landing page with three design options (A, B, C). Each option has all three pages
under its own prefix, e.g. `/b/ld/analytics/course`. Options are listed in
`src/variants/variants.ts`; a floating switcher (bottom right) opens the same page in another
option or goes back to `/`. All three options still show the current design. To restyle one,
copy its pages into `src/variants/<key>/` and point that option's `pages` there.

Only the files these pages need are included (sidebar, layout, footer, styles, NISA assistant shell).
`src/routes/AppRoutes.tsx` and the auto sign-in in `src/main.tsx` (demo L&D admin) are the only
files written for this copy; everything else is unchanged from the original repo.
Sidebar links to other pages fall back to the Home page, since those pages are not in this copy.

## Run

```bash
npm install
npm run dev
```

Opens on http://localhost:32104 (the full app keeps 32103).
