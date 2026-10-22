# Option A build prompts: Home cleanup + Upskill Studio

Run one prompt per Claude Code session, in this order: H1, H2, U0, U1, U2, U3, U4, U5, U6.
Each prompt works through its rows in `docs/upskill-studio/checklist.csv` and ticks them off.

Paste the **shared rules** block at the top of every prompt (it is already included below).

---

## Shared rules (included in every prompt)

```
Project: Vite + React + Tailwind demo of three L&D admin pages. Only touch
Option A (src/variants/a/). Options B and C and everything under src/ outside
src/variants/a/ must stay unchanged. Preview: http://localhost:32106/a/...

Checklist: docs/upskill-studio/checklist.csv. Before starting, read the rows
for this prompt. Work through them in order. When a row is finished, set
Status to "Done", Done on to today's date (YYYY-MM-DD) and a one-line Notes
entry. If a row can't be done, set Status to "Blocked" and say why in Notes.
Keep the CSV valid (quote any field that contains a comma). Don't edit rows
that belong to other prompts.

Design rules for Option A:
- Colours only through the --oa-* CSS variables in src/variants/a/option-a.css
  (theme.ts mirrors them). Don't add new hex values in components.
- One accent: the Option A blue (--oa-primary). Primary buttons are solid blue,
  at most one per view. Everything else is a grey secondary pill. No black
  buttons. Amber only for attention, red only for errors and destructive
  confirmations.
- Sentence case for every label, button and heading (keep NISA, L&D, brand
  names as they are).
- DM Sans, weights 400 and 500 only. Keep the existing card style (white,
  18px radius) and motion helpers.
- Dates in mock data are relative to today (daysAgo / daysFromNow in
  src/variants/a/pages/ld/dashboard/period.ts).
- Don't delete component files; stop rendering them instead.

Finish with: npm run build passes, the page checked in the browser, and a
short reply listing what changed, files touched and anything uncertain.
```

---

## H1: Home cleanup

```
[Shared rules]

Page: Home, src/variants/a/pages/ld/dashboard/. Rows: H1-01 to H1-07.

The profile card (cut-out photo, name, role, four contact details) repeats
what the avatar in the top bar already shows, and takes the most valuable
space on the page. Replace it with a compact greeting row:

1. LDDashboardHeader: remove the profile card. Keep the three KPI cards as
   they are (including the sparkline).
2. Add a greeting row that spans the full content width above the two-column
   grid: "Good morning / afternoon / evening, <first name>" (h1 size 24px),
   subtitle "<weekday>, <d Month yyyy> · <company>" from MOCK_LD_PROFILE.
   No buttons or filters in it. Max 64px tall.
3. page.tsx: remove PHOTO_HEADROOM, the -mt-7 pull-up and the right column's
   top padding, so the KPI row and the NISA card start at the same top edge.
   Remove the now unused profile-cutout import.
4. Program overview tiles show year-to-date totals but a month-vs-month
   trend. Make the comparison explicit, e.g. "+20% vs Sep" (use the previous
   month's short name from the data).
5. MOCK_PROGRAMS has "Becoming Irreplaceable in the Age of AI" active at 100%
   completion, and the Program overview insight cites it. No active program
   should be at 100%. Adjust the data so the insight names an active program
   with a believable figure, and keep every number derived from core.mock.ts.
6. "Learning participants" counts unique trainees, while program enrollments
   add up to more (people join several programs). Add a short subtitle or
   tooltip "Unique trainees" to that KPI card.
7. Verify at 1440px and 375px wide, and that /b/ld/dashboard is unchanged.
```

---

## H2: Fit Home into two screens

```
[Shared rules]

Page: Home, src/variants/a/pages/ld/dashboard/ (plus the two borrowed cards in
src/variants/a/pages/hr/dashboard/components/). Rows: H2-01 to H2-08.
Run after H1 (the greeting row replaces the profile card there).

Goal: the page fits two screens at 1440x900. Screen 1 answers "how are things
today" (greeting, KPIs, Program overview, NISA, start of Active programs).
Screen 2 holds the deeper analysis (Learning mode, Division completion,
License). Total scroll height at most 1,800px. Keep every card and every
figure; this is a density pass, not a content cut.

Target heights per card (at 1440px wide):
- Greeting about 64px, KPI row 133px (from H1)
- Program overview about 480px: chart height 252px to 200px
- Learning mode analytics at most 470px: tighter stats row, completion chart
  180px, less spacing around the divider and the "Completion over time"
  heading
- Division completion at most 480px: one line per division (name in a fixed
  column about 150px, then the bar, then the value), rows about 26px apart.
  Keep the three tiles, the benchmark line and the axis
- NISA insights at most 430px: each insight shows the title and its CTA on one
  row, then the description clamped to 2 lines; tighter gaps
- Active programs unchanged, at most 640px
- License utilization at most 520px: gauge max width 200px, tighter rows

The left column (KPIs to Division completion) and the right column (NISA to
License) should end within 40px of each other.

Verify with a small script in the browser console at 1440x900: log each
card's height and the page's scroll height, and put the numbers in the Notes
of H2-01 and H2-08. Check 375px too, and that /b/ld/dashboard is unchanged.
```

---

## U0: Foundations (buttons, status labels, wording)

```
[Shared rules]

Page: Upskill Studio, src/variants/a/pages/ld/learning_management/courses/.
Rows: U0-01 to U0-04.

1. Copy src/variants/a/ to backup/variant-a-<timestamp>-upskill/.
2. Primary buttons become blue across Option A:
   - In option-a.css, point --oa-button-primary at the Option A blue
     (--oa-primary) and --oa-button-primary-hover at --oa-primary-strong.
     PillButton variant="primary" must render solid blue with white text.
   - Find hardcoded black buttons in Option A (#111111, bg-black or similar):
     Upskill pagination, PendingApprovalSection, the analytics page. Solid
     action buttons use PillButton primary (only if it is the single main
     action of that view), otherwise secondary.
   - Active pagination page: primary tint (background --oa-primary-50, text
     --oa-primary-strong), not a solid fill.
3. One status source: COURSE_STATUS_META in data/courses.mock.ts. Make the
   table, the cards and any status filter read labels and colours from it,
   and remove the duplicated STATUS_STYLES maps in CourseTable.tsx and
   CourseCard.tsx. Labels: Draft, In review, Needs revision, Approved,
   Active, Inactive. Status badge style: small dot in the status colour plus
   the label in --oa-text-body on a neutral pill (no coloured fills).
4. Wording: the page title stays "Upskill Studio"; the items are always
   "course" / "courses". "Create New Upskill" becomes "Create course",
   "Search upskills" becomes "Search courses", "10 upskills" becomes
   "10 courses", "Upskill Library" becomes "Course library".
```

---

## U1: Data model and mock fixes

```
[Shared rules]

Page: Upskill Studio. Files: data/courses.mock.ts and the components that
read it; src/variants/a/pages/hr/learning-management/data/course.mock.ts is
the old review queue source. Rows: U1-01 to U1-08.

The mock contradicts itself today. Fix the data first, before any layout
work, so later prompts only render it:

1. Review queue: derive it from COURSES_MOCK (status 'waiting-approval')
   instead of PENDING_APPROVAL_COURSES. Rule: a user never reviews their own
   course. Courses submitted by the current user (useCurrentUserName) are
   shown as "Waiting for another admin" and never get a Review action.
   Today both queue items were created by Diana herself; make sure at least
   one in-review course belongs to someone else (e.g. Digital Marketing
   Essentials by Rina Wijaya).
2. Courses in NOT_LIVE (draft, in review, needs revision) have 0 enrolled
   trainees.
3. Enrolled never exceeds maxCapacity (Marketing Fundamentals Bootcamp is 30
   enrolled on a 25 seat cap).
4. Versions: one entry per course with its versions (version number, status,
   owner, updated date). Merge the duplicates:
   - AI Ethics & Responsible AI Implementation: v3 Active (Michael Torres)
     plus v4 Draft (Diana Hartwell).
   - Data Privacy Essentials: v1 Active plus v2 Draft (its description
     already says v2 is being drafted while v1 stays live).
   A course's row status is its live version's status. The draft version is
   reachable from that row and also appears in the Draft tab, labelled
   "Version N of <course>". Keep ADMIN_COURSE_VERSIONS consistent with this
   (or derive it).
5. Lifecycle: Approved = signed off and startsOn is in the future. Active =
   running. Inactive = ended, with endedOn and a completed count.
6. Add the fields each status needs for the card footers in U5:
   - Draft: sectionsReady, sectionsTotal
   - In review: submittedOn, startsOn
   - Needs revision: reviewComments: { author, text }[] (at least one; move
     rejectionReason into it)
   - Approved: startsOn, maxCapacity
   - Active: avgCompletion
   - Inactive: endedOn, completed
7. Every date shown on the page is relative to today.
8. Every count (status tab counts, queue count, library total, pagination)
   is derived from the data. Keep two courses per status so every tab has
   content.
```

---

## U2: Header and review strip

```
[Shared rules]

Page: Upskill Studio, page.tsx. Rows: U2-01 to U2-03.

Target layout (top to bottom): header, review strip, course library card.

1. Header: "Upskill Studio" (24px), subtitle "Create, review and assign
   courses for your teams", and on the right one blue primary PillButton
   "Create course" (plus icon) linking where the current button links.
2. Remove the six status stat cards (the statuses move into tabs in U3).
3. Review strip, replacing PendingApprovalSection on this page (keep that
   file): a single white rounded row.
   - Hidden when nothing waits for the current user.
   - One course: amber clock icon in a soft amber circle, "1 course waiting
     for your review", a subline "<title> · by <owner> · submitted <2d ago> ·
     starts in <12 days>", and a secondary "Review" button that opens the
     course.
   - Several: "<N> courses waiting for your review", subline with the one
     that starts soonest, and a secondary "Review all" that switches the
     library to the In review tab and scrolls to it.
   Test all three states by temporarily editing the mock, then restore it.
```

---

## U3: Library toolbar (tabs, filters, view)

```
[Shared rules]

Page: Upskill Studio. Rows: U3-01 to U3-05.

Inside the course library card, top to bottom:

1. Card header: "Course library" with the filtered count ("10 courses").
2. Status tabs with counts, as a segmented control (same look as
   ProgramScopeTabs on Home): All, Draft, In review, Needs revision,
   Approved, Active, Inactive. On narrow screens the row scrolls sideways
   instead of wrapping. Clicking a tab filters the list.
3. One filter row:
   - Search courses (pill input, existing simulated loading)
   - Owner chip with a small menu: Anyone, You, Other admins, Trainers
     (reuse matchesOwnership; this replaces OwnershipTabs on this page only)
   - Type chip: All types, Compliance, Skill training
   - Mode chip: All modes, Blended, Self-paced
   - Sort chip: Last updated (default), Name A to Z, Most enrolled
   - List / grid toggle on the right
   Remove the old status dropdown. Chips show their current value when not
   on the default (e.g. "Owner: You").
4. Default view is list. Remember the viewer's choice in localStorage, every
   read and write wrapped in try/catch, so the page still works when storage
   is blocked.
5. Any filter or tab change resets to page 1. Empty state per tab: a short
   line naming the tab ("No courses in review") and a "Clear filters" action
   when filters are active.
```

---

## U4: Table view

```
[Shared rules]

Page: Upskill Studio, components/CourseTable.tsx. Rows: U4-01 to U4-06.

Rebuild the list view as a compact table:

Columns: Course | Status | Owner | Enrolled | Updated | (actions)

- Course: 44x30 rounded cover (same fallback rule as U5-03), name on one line
  with ellipsis and the full title on hover, subline "<type> · <mode> · v<N>",
  plus a "· 1 draft" toggle when a draft version exists.
- Status: dot plus label from COURSE_STATUS_META.
- Owner: initials avatar plus short name ("M. Torres"); "You" for the current
  user.
- Enrolled: number for Active and Inactive (Inactive in muted text),
  "<enrolled> / <capacity>" for Approved, "Not live" for the rest.
- Updated: relative time (3h ago, 2d ago, 1w ago, 1mo ago).
- Actions: the existing kebab menu (view, hide, delete). Clicking it never
  triggers the row click.

Behaviour:
- Clicking the "1 draft" toggle expands an indented row under the course:
  "Version <N> (draft)", owner, Draft status, "Not live", updated. Works by
  keyboard too (button with aria-expanded).
- Sortable headers: Course, Enrolled, Updated (follow the Sort chip from U3
  and keep them in sync).
- Row click opens the course detail route used today.
- Rows are separated by hairlines, no per-row cards. Row height about 56px.
```

---

## U5: Card view

```
[Shared rules]

Page: Upskill Studio, components/CourseCard.tsx. Rows: U5-01 to U5-05.

Rebuild the grid card to be compact and status-aware:

Anatomy (top to bottom):
- Cover, 84px tall, rounded top. Status badge top left (white pill, dot plus
  label). Kebab button top right (existing menu).
- Name, max 2 lines, fixed height for 2 lines so cards align.
- Subline: "<type> · <mode> · v<N>" plus "· +1 draft" in blue when a draft
  version exists.
- Status footer (below a hairline), see the table.
- Last line, always: owner avatar plus short name on the left, relative
  updated time on the right.

Status footer:
| Status         | Footer |
| Active         | "<x>% completed" and "<n> enrolled", thin blue progress bar |
| In review      | "Waiting for your review" plus a secondary full-width "Review" button, only when the current user is not the owner; otherwise "Waiting for another admin" |
| Needs revision | "<n> reviewer comments" in danger text, then the first comment in quotes (1 line) |
| Draft          | "<ready> of <total> sections ready", segmented bar (one segment per section) |
| Approved       | calendar icon "Starts <d Mon>", "<n> enrolled", seats bar, "<n> of <cap> seats filled" |
| Inactive       | "Ended <d Mon>", "<completed> of <enrolled> completed", secondary "Run again" button; whole card at reduced emphasis (muted text, not opacity on text) |

Cover fallback: when a course has no image, or shares its image URL with
another course in the list, render a tinted cover (--oa-surface-subtle) with
the category icon (reuse components/ui/category-icon.tsx) instead of the
photo. No two cards may show the same stock photo.

Grid: 4 columns from 1280px, 3 from 1024px, 2 from 768px, 1 below.
```

---

## U6: Polish and QA

```
[Shared rules]

Pages: Upskill Studio (and Home for the build check). Rows: U6-01 to U6-05.

1. Sentence case on every label in the files touched by U0 to U5. No new hex
   values (grep the touched files); colours only via --oa-* tokens.
2. Keyboard: status tabs, filter chips and their menus, table rows, version
   toggles, kebab menus and card buttons are reachable by Tab with a visible
   focus ring (--oa-primary at 25% like the existing inputs).
3. Check the page at 1440, 1024 and 375 px wide: no horizontal page scroll
   (the table may scroll inside its own card on small screens), tabs scroll
   sideways, header button stays visible.
4. /b/ld/learning-management/courses and /c/... look exactly as before.
   npm run build passes with no TypeScript errors.
5. Write docs/upskill-studio/CHANGELOG.md: per prompt (H1, U0 to U6) what
   changed, files touched, and open questions for product.
```
