# Option A kit trial: Home cleanup + Upskill Studio

Branch `kit-trial` (worktree `../lnd-admin-3-pages-kit`, preview on port 32110).
`main` holds the version before the kit. One commit per prompt, so any step can
be reverted on its own. Only `src/variants/a/` and this folder changed.

## H1: Home cleanup

- Profile card (photo, name, role, contacts) removed; a greeting row spans both
  columns: "Good afternoon, Diana" / "Thursday, 22 October 2026 · Presight".
- Photo headroom layout removed; KPI row and NISA card share the same top edge.
- Program overview tile trends name the month they compare with ("+20% vs Sep").
- "Becoming Irreplaceable in the Age of AI" set from 100% to 86%; the insight
  still derives from the data.
- "Learning participants" KPI gets a "Unique trainees" hint.
- Phones: the sidebar starts collapsed below 768px, card headers wrap, Learning
  mode stats stack, footer links wrap.
- The KPI sparkline was not restored (it was removed on request before the kit).

Files: `pages/ld/dashboard/page.tsx`, `components/LDDashboardHeader.tsx`,
`components/LDDashboardProgramOverview.tsx`, `components/LDDashboardLearningAnalytics.tsx`,
`data/dashboard.mock.ts`, `types/dashboard.types.ts`, `components/ui/kit.tsx`,
`layouts/DashboardLayout.tsx`, `components/Footer.tsx`.

## H2: Fit Home into two screens

At 1440x900: greeting 54, KPI 131, Program overview 466, Learning mode 467,
Division 480, NISA 404, Active programs 634, License 516; page 1,793px; the
columns end 1px apart.

- Program overview chart 252 to 200px.
- Learning mode: chart 180px, tighter stats and divider spacing.
- Division completion: one line per division (name, bar, value), 26px rows;
  benchmark line and axis aligned to the bar column.
- NISA: title and CTA on one row, description clamped to 2 lines.
- License: gauge max 200px, tighter rows.

Files: the dashboard components above, `pages/hr/dashboard/components/DashboardDivisionsPerformance.tsx`,
`DashboardLicenseUtilization.tsx`, `LDDashboardNissaInsight.tsx`.

## U0: Foundations

- `--oa-button-primary` now points at `--oa-primary` (hover `--oa-primary-strong`):
  primary buttons are solid blue. No black buttons left (Analytics and Upskill
  pagination use the primary tint; the Pending approval CTA is secondary).
- One status source: `components/CourseStatus.tsx` (`StatusLabel`, `StatusBadge`)
  reads `COURSE_STATUS_META`; the `STATUS_STYLES` copies in CourseTable and
  CourseCard are gone. Badges are a dot plus label on a neutral pill.
- Items are always "course(s)".

## U1: Data model

- One entry per course with `versions[]`. AI Ethics is v3 Active (M. Torres) +
  v4 Draft (Diana); Data Privacy is v1 Active + v2 Draft. Drafts appear in the
  Draft tab as "Version N of <course>". `ADMIN_COURSE_VERSIONS` is derived.
- Review queue from `COURSES_MOCK`; nobody reviews their own course (Diana's
  "Business Writing for Managers" reads "Waiting for another admin").
- Not-live courses have 0 enrolled; enrolled never exceeds capacity.
- Lifecycle fields per status (sections, submittedOn/startsOn, reviewComments,
  endedOn/completed). Two new courses keep two per status.
- All dates relative to today; all counts derived.

## U2: Header and review strip

- Header with one blue "Create course".
- Review strip: hidden when empty; one course opens it with "Review"; several
  read "N courses waiting", name the soonest start and offer "Review all"
  (switches to In review). All three states tested by editing the mock.

## U3: Library toolbar

- "Course library" header with the filtered count.
- Filter chips with menus (`components/FilterChip.tsx`): Owner, Type, Mode, Sort.
  A chip off its default reads "Owner: Trainers".
- List is the default; the choice is kept in localStorage (guarded).
- Every change resets to page 1; empty states per tab with "Clear filters".

## U4: Table

- `components/CourseLibraryTable.tsx` (the list the page renders; the older
  `CourseTable.tsx` is kept): 44x30 cover, one-line name, "type · mode · vN" and
  a "· 1 draft" toggle that opens "Version N (draft)".
- Enrolled: number (Inactive muted), "22 / 25" for Approved, "Not live" otherwise.
- Course, Enrolled and Updated headers share the Sort chip's state.
- Rows 56px, hairlines; the table scrolls inside its card on phones.

## U5: Cards

- `components/CourseCard.tsx` rebuilt: 84px cover with status badge and menu,
  2-line name, status footer per status (Active, In review, Needs revision,
  Draft, Approved, Inactive), then owner and last update.
- `components/CourseCover.tsx`: tinted cover with the category icon when a
  course has no photo or shares it with another course.
- Grid 4 / 3 / 2 / 1 columns at 1280 / 1024 / 768 / below.

## U6: Polish and QA

- No new hex values in touched files (diff against `main`).
- Sentence case on the touched Analytics page headings and Pending approval.
- Focus rings on pills, chips, menus, rows, toggles, kebabs, view toggle and
  pagination.
- 1440, 1024 and 375: no horizontal page scroll; tabs scroll sideways; the
  header button stays visible.
- Options B and C: no files changed; both pages render.
- `npm run build` passes. A TypeScript check was not run: the project has a
  tsconfig but no TypeScript compiler installed, and installing one was out of
  scope.

## U7: Card polish

- `components/CourseCard.tsx`: the card is a flex column with a fixed 80px
  footer pinned to the bottom (status line, figure, progress slot), so cards in
  a row end on the same line. Title fixed at two lines, description one line.
- Footer figures at 20px with their words ("80% completed", "20 days to
  start"); Active adds the enrolled count and a thin blue bar.
- Buttons: View, Comments, Continue and Run again removed. Review (new tint
  PillButton) only on someone else's in-review course. Kebab kept; it and the
  deactivate dialog no longer open the card.
- Waiting lines are plain text: "Waiting for another admin" muted, "Waiting
  for your review" strong.
- `components/CourseStatus.tsx`: badge on the photo is a white pill with the
  label in the status colour (`COURSE_STATUS_META.text`), no dot.
- `components/CourseCover.tsx`: photos slightly desaturated (80%) everywhere.
  The AI Ethics cover (a ChatGPT screenshot) is now
  `assets/courses/abstract-shapes.jpg`, cropped from a project image.
- The demo has no course page, so opening a course (card or Review) still lands
  on Home.

## Analytics (A1 to A5)

Visual pass on `/a/ld/analytics/course`. Every card and every number stays;
only colour fields in the mock data changed (to tokens).

- A1, foundation: backup in `backup/variant-a-20261022-171101-analytics/`. No
  hex left in the page, the funnel or the license card; the purple and the
  extra blues are gone. Sentence case everywhere, and nouns follow the
  Courses/Journeys tab. Data values show as Self-paced, Blended and Skill
  training (mapped at render, data keys unchanged). KPI cards in the Home card
  style with units (per course, / 5, / 100) and "vs last quarter" trends; the
  rating trend is in points.
- A2, charts: the donut uses Blended = primary and Self-paced = primary-200
  (blue, not the green mode token, at the user's request). Mode rows are plain
  hairline rows with a stacked bar. The learning funnel keeps the flow ribbon
  built earlier at the user's request (4 stages, split by mode, stage table
  underneath); below 768px it turns into one bar per stage. The old side stage
  cards and bottom summary were not brought back (A2-05 blocked).
- A3, tables: Active courses and Top/Bottom courses use hairline rows, thin
  single-blue bars, a grey star with the rating and grey rank numbers; the
  right-hand value follows the selected metric. "Assigned but not started" warns
  only with the amber "N courses idle" chip and amber idle days from 10.
- A4, bottom cards: `DashboardLicenseUtilization` takes a `licenses` prop (Home
  unchanged) and shows the four license sources here, replacing the pie and the
  AI paragraph. Last updated and Expired certifications are hairline rows with
  round chips and "4 Mar 2026, 14:32" dates. Feedback shows the scores as
  sortable numeric pills, the feedback text clamped to 2 lines, and the trainee
  with an avatar and the course underneath.
- A5, QA: diff against the backup shows only colour fields and the moved
  license totals. Focus rings on tabs, sort headers, search and pagination. 1440,
  1024 and 375 have no horizontal page scroll. Home's license card and
  `/b/ld/analytics/course` are unchanged. `npm run build` passes; TypeScript
  check still not run (no compiler installed).

Files: `pages/ld/analytics/course/page.tsx`,
`pages/ld/analytics/course/components/LearningProgressFunnel.tsx`,
`pages/hr/dashboard/components/DashboardLicenseUtilization.tsx`.

## Option B: B1 and B2

Option B only (`src/variants/b/`); Option A unchanged.

- B1, one accent: summary tiles, the Program overview chart and the division
  bars use blue as the only accent (the picked tile's icon and bar, the
  highlighted bar and month). Unselected tiles are grey. Green and red trend
  pills, the green Self-paced series and amber attention stay. The license
  gauge is orange, at the user's request during the run (B1-04 asked for
  blue).
- B2, section rhythm: section rules run edge to edge in their column and meet
  the column divider; lines inside a section use the new `--ob-border-subtle`
  and the vertical ones stop 4px short of the top and bottom. Every section has
  40px top, 32px bottom and 32px side padding, 20px between header and content
  and between content and insight. Section headers: 18px semibold title, 13px
  subtitle, tabs and links centred on the title block.

Files: `components/ui/kit.tsx`, `option-b.css`, `theme.ts`,
`pages/ld/dashboard/page.tsx`, `pages/ld/dashboard/components/`
(`LDDashboardHeader`, `LDDashboardProgramOverview`,
`LDDashboardLearningAnalytics`, `LDDashboardActivePrograms`),
`pages/hr/dashboard/components/` (`DashboardDivisionsPerformance`,
`DashboardLicenseUtilization`).

## Open questions for product

1. Can an admin approve a course they created? Built as no.
2. Approved vs Active: built as Approved = signed off, starts in the future.
3. Do drafts track section completeness, reviewer comments and seat capacity
   in the real platform? The card footers rely on them.
4. AI Ethics' live version belongs to a trainer while Diana drafts v4: can
   someone other than the owner draft a new version?
5. Data labels on the Analytics page ("Skill Training", "Blended Learning")
   are title case in the data; since A1 they show in sentence case.
6. Updated times are day-precise ("Today"), so there is no "3h ago".
7. Analytics figures still disagree in places (for example "Becoming
   Irreplaceable" at 100% completion, and totals that differ from Home). The
   A pass was visual only, so the data was left as is.

## Option B: B3 to B8 (own identity)

Option B only (`src/variants/b/`); Option A unchanged.

- B3, compact profile: built and tried, then reverted at the user's request.
  Home keeps the 130px square photo. No headroom offsets are left, and the
  profile follows the section rhythm. NISA is now one solid blue section, edge
  to edge in its column, with no card frame (chat request).
- B5, foundations:
  - Shape tokens: `--ob-radius-control` 6px and `--ob-radius-card` 12px.
    `--ob-radius-button` is 14px, a square with almost round corners, as the
    user asked (the kit said 8px).
  - Numbers use Geist Mono through `.ob-num`; `NumText`, `NUM_TICK` and
    `svgNumText` keep units and words in Inter.
  - Every progress bar is 4px tall with 2px corners.
  - Self-paced is the pale blue.
  - The license gauge is orange only below 25% usage.
  - The last hex values are now tokens, and `OA` is renamed `OB_PALETTE`.
  - The learning funnel is green, by the user's request.
- B6, components:
  - Underline tabs everywhere.
  - Outlined status tags in the table and on the card photos (the card menu
    moved to the photo).
  - The NISA insight line has a left rule and no box.
  - Search, pagination (new shared `components/ui/pagination.tsx`) and the
    view toggle are 6px outlined controls.
  - Filter chips stay in the hairline toolbar as 6px white controls, outlined
    in blue while filtering.
- B7, page fixes:
  - Upskill: the review strip has an orange left rule and no blue band; the
    table subline is muted and the headers are 11px with letter spacing.
  - Analytics: the KPIs stay on one line (Avg. enrollment gets a wider
    column); Top and Bottom names wrap to two lines.
  - Analytics: the donut ring is 10px, as the kit asks (it replaces the
    earlier thick donut).
- B8, QA:
  - No imports from Option A, and no hex outside the tokens apart from the
    unrendered mock icon colours.
  - `rounded-full` is used only for avatars, dots, icon circles, the orb and
    rank badges.
  - Nothing outside `src/variants/b` changed, and `npm run build` passes.
