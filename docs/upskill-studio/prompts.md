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


---

## U7: Card polish

```
[Shared rules]

Page: Upskill Studio, components/CourseCard.tsx (grid view). Rows: U7-01 to
U7-09. Keep the cover photo size exactly as it is now. Keep the kebab (three
dots) menu. Don't use coloured status dots anywhere on the card.

1. Equal heights: make the card a flex column and pin the footer to the
   bottom with a fixed height, so every card in a row ends on the same line.
   Every status reserves the same rows: the status line slot is always
   there, even when a status has nothing to say.
2. Title: fixed height for 2 lines with line clamp. Description: clamp to
   1 line.
3. Footer numbers ("80%", "20d", "12d") go from ~44px down to 20 to 24px, so
   the course title stays the strongest text on the card. The Active footer
   shows "80% completed" and the enrolled count with a thin blue progress
   bar under them. Other statuses keep their footer content (for example
   "20 days to start"), just at the smaller size.
4. Remove the "View" button from every card; the whole card already opens
   the course. Keep the kebab menu, and make sure clicking it never opens
   the card.
5. "Review" is the only button in the footer, shown only on in-review
   courses owned by someone else. Style: primary tint pill (background
   --oa-primary-50, text --oa-primary-strong). It opens the course review.
6. Waiting lines: "Waiting for another admin" in --oa-text-muted, and
   "Waiting for your review" in --oa-text-strong. Neither is blue or styled
   as a link (they aren't clickable).
7. Status badge on the photo: white pill, no dot, label text coloured by
   status through --oa-* tokens: Active blue, In review amber, Needs
   revision red, Approved green, Draft and Inactive grey. In review and
   Needs revision must be clearly different at a glance.
8. Photos: same size as today. Give all covers one shared treatment so they
   read as a set (a slight desaturation, or a very light blue overlay, pick
   one and apply it everywhere). Replace the cover that shows a ChatGPT /
   OpenAI screenshot with a neutral photo that has no product branding.
9. Verify at 1440, 1024 and 375 px wide, /b/ld/learning-management/courses
   unchanged, npm run build passes.
```

---

# Analytics: visual pass (A1 to A5)

Page: Analytics > Learning program, src/variants/a/pages/ld/analytics/course/
(page.tsx and components/LearningProgressFunnel.tsx). Run after U0 so the
button colours are already set. The A series is independent of the Upskill
prompts.

**This series is visual only.** Every card stays, every number stays. Data
contradictions on this page (totals, completion figures, licenses vs Home) are
a separate, later task.

## A1: Foundations (tokens, type, labels, KPIs)

```
[Shared rules]

Page: Analytics > Learning program (route /ld/analytics/course). Rows: A1-01
to A1-07. Visual only: do not remove any card and do not change any data
value. Data keys stay as they are; only what is displayed changes.

1. Copy src/variants/a/ to backup/variant-a-<timestamp>-analytics/.
2. Tokens: replace every hardcoded hex in page.tsx and
   components/LearningProgressFunnel.tsx with the --oa-* variables from
   src/variants/a/option-a.css (add a token only if one is truly missing,
   and document it in theme.ts). Remove the off-palette colours: the purple
   #4E5BA6 and the extra blues (#4285F4, #669DF6, #8AB4F8, #185ABC,
   #1967D2) that are used to tell categories apart. Blue means "the thing
   that matters"; categories get grey or the Home mode colours.
3. Sentence case for every heading, tab, chip and label, for example
   "Total courses", "Avg. enrollment", "Courses by mode", "Learning progress
   funnel", "Top courses", "Highest enrollment", "Courses assigned but not
   started". The noun follows the Courses / Journeys tab as today.
4. Display labels: show "Self Learning" as "Self-paced" and "Blended
   Learning" as "Blended", like Home. Keep the data values unchanged; map
   them at render time.
5. Type scale: content text at least 12px. 11px only for chart axis ticks
   and tiny captions. Metadata lines ("Skill training · Blended · 12 hours")
   in --oa-text-muted at 12px.
6. KPI cards: match the Home KPI card exactly (padding, icon circle, 24px
   value, units in 13px muted: "88 per course", "81 / 100", equal heights).
   Trend labels say what they compare to: "+10% vs last quarter". The rating
   trend shows points ("+0.1"), not a percentage. Keep all five cards.
7. Active pagination page: primary tint (background --oa-primary-50, text
   --oa-primary-strong). Skip if U0 already changed it.
```

## A2: Courses by mode and the funnel

```
[Shared rules]

Page: Analytics > Learning program. Rows: A2-01 to A2-06. Visual only.

Courses by mode:
1. Donut colours: Blended = --oa-primary, Self-paced = --oa-mode-self (the
   same colours as Learning mode analytics on Home). Keep the total in the
   centre and the legend underneath.
2. Breakdown under the donut: plain rows split by hairlines instead of the
   tinted boxes. One stacked bar per mode: Active in the mode colour, Done
   in a lighter tint of the mode colour, Inactive in grey. Every percentage
   gets a label ("64% active").

Funnel (LearningProgressFunnel.tsx):
3. Replace the three SVG trapezoids with a flow ribbon:
   - Three stages left to right: Enrolled, Started, Completed. The ribbon's
     thickness is proportional to the count at each stage, with a short flat
     section at each stage and smooth cubic curves between stages, so it
     narrows from left to right.
   - One blue fill (--oa-primary). A very soft blue radial glow behind the
     ribbon is allowed (like the page background). No drop shadows.
   - At each stage: a thin white vertical line through the ribbon, a white
     pill above it with the stage count, a white pill below it with the
     conversion ("83% started", "72% completed"), and the stage name above
     the top pill. Pills use the card border token.
   - When the Courses / Journeys tab changes, the ribbon morphs to the new
     counts (reuse the existing FadeValue / motion helpers).
4. If the mock already has counts per learning mode for each stage, split
   the ribbon into two layers (Blended blue on top, Self-paced green below)
   and add a small legend. If it doesn't, keep one blue layer and say so in
   the row's Notes. Don't invent new data.
5. Keep the stage cards on the right and the summary at the bottom, but
   restyle them: plain rows with hairlines, no coloured icon circles,
   numbers at 14 to 16px, labels at 12px, drop-off text in attention amber
   (--oa-attention-text) instead of red.
6. Below 768px wide, render the funnel as three horizontal bars (one per
   stage, one blue, count on the right, conversion as a caption between
   bars) instead of the ribbon.
```

## A3: Course lists (Active, Top, Bottom, Not started)

```
[Shared rules]

Page: Analytics > Learning program. Rows: A3-01 to A3-04. Visual only.

1. Active courses table: hairline rows (no row backgrounds), the same row
   rhythm as the Upskill Studio table. Completion as a thin single-blue bar
   with the percentage next to it. Rating as a small grey star plus the
   number. Metadata line in muted 12px. Keep columns, sorting and
   pagination.
2. Top courses and Bottom courses: remove the crown icon and the coloured
   rank badges. Ranks become numbers in small grey circles. The first row
   is no longer blue. Rows are hairline list rows, with no bordered boxes
   and no hover shadow. Keep both cards and their metric tabs.
3. In both cards, the value on the right of each row is the selected metric:
   enrolled count for enrollment, a thin bar plus percentage for
   completion, star plus number for rating. Today the rows always show
   enrolled and rating, whatever tab is selected.
4. Courses assigned but not started: keep the amber "N courses idle" chip
   in the header as the only warning signal. Remove the warning icon circle
   in the header and the warning icon on every row. Rows idle 10 days or
   more show the idle days in attention amber; others in grey. Remove the
   blue row tint. Hairline rows like the lists above.
```

## A4: Licenses, insight, updates, certifications, feedback

```
[Shared rules]

Page: Analytics > Learning program, plus
src/variants/a/pages/hr/dashboard/components/DashboardLicenseUtilization.tsx.
Rows: A4-01 to A4-05. Visual only.

1. Source mapping: give it the same visual as the License utilization card
   on Home (segmented half gauge with the percentage in the middle, "x of y
   seats used · z idle", one row per license with initials circle, thin bar
   and attention amber for low usage). Do this by making the Home component
   accept a `licenses` prop (keeping its current data as the default, so
   Home looks the same) and rendering it here with this page's
   SOURCE_MAPPING data. Title: "License utilization".
2. Replace the "AI Insight Analysis" paragraph blocks with the shared
   one-line AIInsightLine (full text on hover, "Ask NISA" link), as on Home.
3. Last updated: hairline rows; the change type (Content, Structure,
   Assessment) as neutral chips; one date format, e.g. "4 Mar 2026, 14:32".
4. Expired certifications: hairline rows with an initials avatar for the
   holder; days expired on the right in attention amber from 30 days, grey
   below. No other warning colours.
5. Recent learner feedback table:
   - Replace the three star columns (rating, relevancy, duration) with
     compact numeric scores ("5.0") in a neutral pill; keep the columns
     sortable.
   - Feedback text gets the widest column and wraps to 2 lines (full text
     on hover).
   - Trainee as initials avatar plus name; course name as a muted subline
     under the trainee, so the row reads "who, about what, said what".
   - Search keeps working; hairline rows.
```

## A5: QA

```
[Shared rules]

Page: Analytics > Learning program (plus Home for the shared license card).
Rows: A5-01 to A5-05.

1. Compare with the A1 backup: no card removed, no data array changed (diff
   the mock data blocks in page.tsx and LearningProgressFunnel.tsx).
2. Only --oa-* tokens in the touched files (grep for hex); sentence case
   everywhere.
3. Keyboard: tabs, sortable headers, search, pagination and the funnel's
   Courses / Journeys switch show a visible focus ring.
4. Check 1440, 1024 and 375 px wide: no horizontal page scroll (tables may
   scroll inside their own card). Home's License card still looks the same.
5. /b/ld/analytics/course is unchanged and npm run build passes. Add an
   "Analytics (A1 to A5)" section to docs/upskill-studio/CHANGELOG.md.
```


---

# Option B: style pass

## B1: One accent colour on Home

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Option A, Option C and everything
under src/ outside src/variants/b/ must stay unchanged. Preview:
http://localhost:32106/b/ld/dashboard

Checklist: docs/upskill-studio/checklist.csv, rows B1-01 to B1-05. Work
through them in order. When a row is finished set Status to "Done", Done on
to today's date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be
done set "Blocked" and say why. Keep the CSV valid.

Style only: do not change any content, label, number or layout. Colours only
through the --ob-* variables in src/variants/b/option-b.css (OB_COLORS in
src/variants/b/theme.ts mirrors them for SVG and recharts props).

Rule: blue (--ob-primary) is the one accent and marks "what is selected or
what matters". Green and orange must not be used just to tell tiles apart.

1. src/variants/b/components/ui/kit.tsx, MetricTile:
   - Selected tile: the small icon and the bottom bar use --ob-primary (the
     current blue gradient), full strength.
   - Unselected tiles: icon in --ob-text-subtle (--ob-text-muted on hover),
     bottom bar in a neutral grey fill (--ob-border-strong) on the existing
     --ob-surface track. Keep the bar's width logic (`share`) as it is.
   - Stop using a per-tile colour for the icon and the bar. Remove the
     `color` prop or keep it unused, and update the callers.
2. src/variants/b/pages/ld/dashboard/components/LDDashboardProgramOverview.tsx:
   remove the per-metric colours (OB_COLORS.modeSelf and OB_COLORS.orange in
   METRICS). The highlighted bar in the chart, its gradient defs and the
   selected month label are always OB_COLORS.primary, whichever metric tile
   is picked.
3. src/variants/b/pages/hr/dashboard/components/DashboardDivisionsPerformance.tsx:
   remove GROUP_COLOR. Highlighted division bars always use the blue
   gradient; divisions that are not highlighted stay grey as today. Tiles
   follow the MetricTile change from step 1.
4. src/variants/b/pages/hr/dashboard/components/DashboardLicenseUtilization.tsx:
   the reference-style tick gauge fills its active ticks with
   OB_COLORS.primary instead of OB_COLORS.modeSelf (keep the opacity ramp
   and the animation). The "N idle" text stays in attention amber.
5. Keep these colours, they carry meaning: green and red trend pills, the
   green Self-paced line and bar in Learning mode analytics, amber for
   attention items.

Verify: open /b/ld/dashboard at 1440 and 1280 px wide, click every metric
tile in Program overview and Division completion and check that only blue
appears as an accent. Check that /a/ld/dashboard looks exactly as before and
that npm run build passes. Reply with the files you touched.
```


## B2: Section rhythm, keeping the hairline layout

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Option A, Option C and everything
under src/ outside src/variants/b/ must stay unchanged. Preview:
http://localhost:32106/b/ld/dashboard

Checklist: docs/upskill-studio/checklist.csv, rows B2-01 to B2-05. Work
through them in order. When a row is finished set Status to "Done", Done on
to today's date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be
done set "Blocked" and say why. Keep the CSV valid.

Style only: keep the frameless layout where sections sit on the white page
and are split by hairlines. Do not add cards or backgrounds, do not change
any content, label or number. The NISA card keeps its blue card. Colours only
through the --ob-* variables in src/variants/b/option-b.css.

Problem: today every line has the same colour and the same inset (the Rule
between sections is mx-8, like the lines inside sections), so section breaks
and in-section dividers look identical and the page reads as one long
document. Fix it with two levels of lines plus a steady spacing rhythm.

1. Section rules: in src/variants/b/pages/ld/dashboard/page.tsx, the Rule
   between sections runs edge to edge across its column (no side inset), so
   it meets the vertical hairline that splits the two columns. Colour stays
   --ob-border. This makes the page read as a grid of sections.
2. Lines inside sections: add a lighter token --ob-border-subtle to
   option-b.css (about halfway between --ob-surface and --ob-border, mirror
   it in OB_COLORS) and use it for:
   - the vertical dividers between the three KPIs (LDDashboardHeader, flat
     mode) and between MetricTiles (components/ui/kit.tsx). Make these
     vertical lines inset: they stop about 4px short of the top and bottom
     of the tile row instead of running full height;
   - any other horizontal line inside a section.
   In LDDashboardLearningAnalytics, replace the border-t above "Completion
   over time" with spacing (24px), no line.
3. Spacing rhythm, the same for every section in both columns: 40px top,
   32px bottom, 32px left and right; 20px between the section header and its
   content; 20px between the content and the insight row at the bottom. The
   right column keeps the NISA card aligned with the profile as today.
4. Section headers: title 18px semibold (--ob-text-strong), subtitle 13px
   --ob-text-muted with 2px gap, and any tabs or "See all" link vertically
   centred on the title block. Apply the same header to Program overview,
   Learning mode analytics, Division completion, Active programs and License
   utilization.
5. Verify at 1440 and 1280 px wide: section lines clearly longer than the
   lines inside sections, both columns on the same rhythm, nothing else
   changed. /a/ld/dashboard looks exactly as before and npm run build passes.
   Reply with the files you touched.
```


## B3: Compact profile, NISA as the one focal point

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Option A, Option C and everything
under src/ outside src/variants/b/ must stay unchanged. Preview:
http://localhost:32106/b/ld/dashboard

Checklist: docs/upskill-studio/checklist.csv, rows B3-01 to B3-05. Work
through them in order. When a row is finished set Status to "Done", Done on
to today's date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be
done set "Blocked" and say why. Keep the CSV valid. Run after B2.

Style only: keep every piece of content (photo, name, job title, company,
email, location, phone). Colours only through the --ob-* variables in
src/variants/b/option-b.css.

Why: the top of Home has two heavy elements competing, the big cut-out photo
on the left and the solid blue NISA card on the right. The demo's story is
NISA, so the photo becomes small and NISA becomes the one focal point of the
first screen.

1. In src/variants/b/concepts/ProfileHeroCard.tsx, add a compact variant
   (a `variant="compact"` prop, or a sibling component in the same folder):
   - Photo: 64px rounded square (radius 14px) on an --ob-surface background,
     cropped so the face sits in the frame (object-cover, aligned to the top
     of the image). Use the existing photo.
   - Beside the photo: name at 22px semibold (--ob-text-strong), job title
     at 14px (--ob-text-muted) under it.
   - Contact details (company, email, location, phone) on one line with
     their small icons, separated by generous gaps, to the right of the name
     block on wide screens and under it on narrow ones. They may wrap to a
     second line but are never truncated.
   - Target height for the whole profile section: at most 120px at 1440px.
   Keep the big cut-out version available (the default variant), just not
   used on Home.
2. src/variants/b/pages/ld/dashboard/page.tsx: render the compact variant.
   Remove the PROFILE_HEADROOM offsets, so the profile section and the NISA
   card in the right column start at the same top edge.
3. The profile section uses the same section rhythm as the rest of the page
   (from B2: padding, and the full-width section rule underneath it).
4. Leave the NISA card exactly as it is (solid blue); it is now the
   strongest element at the top.
5. Verify at 1440 and 1280 px wide: contacts fully visible, profile section
   at most 120px tall, NISA reads as the main focal point, KPIs moved up.
   /a/ld/dashboard looks exactly as before and npm run build passes. Reply
   with the files you touched.
```


## B4: Orange attention colour and a sticky right column

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Option A, Option C and everything
under src/ outside src/variants/b/ must stay unchanged. Preview:
http://localhost:32106/b/ld/dashboard

Checklist: docs/upskill-studio/checklist.csv, rows B4-01 to B4-05. Work
through them in order. When a row is finished set Status to "Done", Done on
to today's date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be
done set "Blocked" and say why. Keep the CSV valid.

Style and layout only: do not change any content, label or number. Colours
only through the --ob-* variables in src/variants/b/option-b.css (OB_COLORS
in src/variants/b/theme.ts mirrors them).

Part 1: orange is the one attention colour for Option B
The License utilization gauge uses the orange family (--ob-orange #FB6514,
--ob-orange-strong, --ob-orange-surface) and that is now the reference
colour for anything that needs attention. Today other attention items (the
"36 idle" text, at-risk rows in Active programs, the O'Reilly renewal
warning, the "needs attention" items) use amber (#B54708, #FEC84B, #FEF0C7,
#FFFAEB), so the page shows two warm warning colours.

1. In option-b.css, re-point the attention tokens to the orange family:
   - --ob-attention-bar: var(--ob-orange)
   - --ob-attention-text: var(--ob-orange-strong) (orange text on white
     needs the darker shade to stay readable)
   - --ob-attention-track: var(--ob-orange-surface)
   - --ob-attention-surface: a lighter tint of the same orange (add it if
     needed)
   Mirror the values in OB_COLORS.
2. Find every other place in src/variants/b/ that uses amber or yellow to
   mean "needs attention" (--ob-warning, ATTENTION constants in
   components/ui/kit.tsx, hardcoded amber hex) and point it at the
   attention tokens. Keep the gauge exactly as it looks now.
   Course status colours (Draft, In review, Needs revision, Approved,
   Active, Inactive) are a separate system and stay as they are.

Part 2: sticky right column on Home
The right column (NISA, Active programs, License utilization) is about 250px
shorter than the left column, so the bottom right of the page goes empty
while scrolling to Division completion.

3. In src/variants/b/pages/ld/dashboard/page.tsx, from the lg breakpoint up,
   make the right column sticky so it always fills its side:
   - The column scrolls normally until its last section (License
     utilization) is fully in view, then it holds still while the left
     column keeps scrolling ("sticky to the bottom").
   - If the column is shorter than the visible area, it sticks just below
     the top bar instead.
   - Implement with position: sticky on an inner wrapper and a top value of
     min(top bar offset, visible height - column height - bottom gap),
     recalculated on resize and when the column's height changes
     (ResizeObserver). The page scrolls inside the layout's scroll
     container, not the window, so measure against that container.
   - Every part of the right column must stay reachable by scrolling.
4. Keep the vertical hairline between the columns running the full page
   height: leave the border on the full-height grid cell and make only the
   inner wrapper sticky. Below lg nothing is sticky.
5. Verify at 1440 and 1280 px wide by scrolling from top to bottom: no empty
   area at the bottom right, divider unbroken, only one warm warning colour
   on the page. /a/ld/dashboard looks exactly as before and npm run build
   passes. Reply with the files you touched.
```


---

# Option B: own identity (B5 to B8)


## B5: Option B foundations (shape, numbers, colour system)

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Option A, Option C and everything
under src/ outside src/variants/b/ must stay unchanged. Pages:
/b/ld/dashboard, /b/ld/analytics/course, /b/ld/learning-management/courses

Checklist: docs/upskill-studio/checklist.csv, rows B5-01 to B5-06. Work through them
in order. When a row is finished set Status to "Done", Done on to today's
date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be done set
"Blocked" and say why. Keep the CSV valid.

Style only: do not change any content, label, number or section. Colours
only through the --ob-* variables in src/variants/b/option-b.css (mirrored in
src/variants/b/theme.ts).

Goal of B5 to B8: Option B must look clearly different from Option A while
being one consistent style across its three pages. Today B is "Option A
without cards": 21 files are identical to A and the shared components (pill
tabs, filled status pills, the tinted insight row, pill filters and
pagination) look exactly like A. Option B's own language is: frameless
sections split by hairlines, Inter for text with Geist Mono for numbers,
squarer shapes, underline tabs, outlined status tags, a left-rule NISA
insight line, blue as the one accent and orange only for attention.

1. Shape tokens in option-b.css: --ob-radius-control: 6px (chips, tags,
   inputs, filter buttons, pagination, tabs' focus ring), --ob-radius-button:
   8px (the 3D buttons keep their gradient and shadow, only the corner
   changes), --ob-radius-card: 12px (NISA card, dialogs, menus). Replace
   pill shapes (rounded-full and large radii) on controls with these. Keep
   round only for avatars and pure circles (icon circles, orbs).
2. Numbers: load Geist Mono (Google Fonts, weights 400 and 500) in
   option-b.css and add a .ob-num class (font-family Geist Mono,
   font-variant-numeric: tabular-nums, letter-spacing -0.02em at 20px and up,
   0 below). Apply it to every data number on the three pages: KPI and tile
   values, chart value labels and axis ticks, the gauge percentage, funnel
   pills and table, table number columns (enrolled, scores, dates can stay
   Inter), list percentages and counts, "+14" avatar counts. Units and
   words next to numbers stay Inter.
3. Progress bars everywhere in B: 4px tall with 2px corners (not fully
   round): Active programs, license rows, MetricTile bars, completion bars,
   attendance and hours bars.
4. One mode colour system: point --ob-mode-self (and OB_COLORS.modeSelf) at
   a pale primary tint (the same pale blue the Analytics donut and funnel
   already use). Home's Learning mode analytics (lines, hours bar, legend)
   follows automatically or is updated to it. Green is used only for
   positive trend pills.
5. Orange means attention only: the license gauge fills orange when usage is
   below the card's low-usage threshold and blue otherwise (Home's 20% stays
   orange, Analytics' 76% becomes blue).
6. Replace the remaining hardcoded hex with --ob-* tokens in:
   CourseTable.tsx, PendingApprovalSection.tsx, DeleteVersionDialog.tsx,
   NisaOrb.tsx, OwnershipTabs.tsx, Footer.tsx, CreatorDisplay.tsx,
   category-icon.tsx, Sidebar.tsx, CourseFilterTabs.tsx. In theme.ts rename
   the `OA` export to `OB_PALETTE` and update its imports.
```


## B6: Option B components (tabs, status tags, insight line, controls)

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Option A, Option C and everything
under src/ outside src/variants/b/ must stay unchanged. Pages:
/b/ld/dashboard, /b/ld/analytics/course, /b/ld/learning-management/courses

Checklist: docs/upskill-studio/checklist.csv, rows B6-01 to B6-05. Work through them
in order. When a row is finished set Status to "Done", Done on to today's
date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be done set
"Blocked" and say why. Keep the CSV valid.

Style only: do not change any content, label, number or section. Colours
only through the --ob-* variables in src/variants/b/option-b.css (mirrored in
src/variants/b/theme.ts).

Goal of B5 to B8: Option B must look clearly different from Option A while
being one consistent style across its three pages. Today B is "Option A
without cards": 21 files are identical to A and the shared components (pill
tabs, filled status pills, the tinted insight row, pill filters and
pagination) look exactly like A. Option B's own language is: frameless
sections split by hairlines, Inter for text with Geist Mono for numbers,
squarer shapes, underline tabs, outlined status tags, a left-rule NISA
insight line, blue as the one accent and orange only for attention.

These components exist as copies in src/variants/b but are still identical to
Option A. Restyle the B copies (never import from src/variants/a):

1. Tabs (ProgramScopeTabs and every other tab set in B: Home scope tabs,
   Analytics Courses / Journeys, Top and Bottom metric tabs, Active programs
   filter, Upskill status tabs): underline tabs. Plain text labels 13px,
   --ob-text-muted, active label --ob-text-strong with a 2px --ob-primary
   underline that slides between tabs (reuse the existing motion), a
   hairline (--ob-border) along the bottom of the tab row, no pill
   background. Counts in Upskill status tabs use .ob-num in
   --ob-text-subtle.
2. Status tags (CourseStatus and COURSE_STATUS_META in B, used by the table
   and the cards): outlined tag, white background, 1px border in the status
   tint, label in the status colour, 11 to 12px medium, 22px tall, 6px
   radius, no fill and no dot. Colours (add --ob-status-* tokens if needed):
   Active blue, In review violet, Needs revision orange (B's attention
   colour, not red), Approved green, Draft and Inactive grey. On card photos
   use the same tag with a very soft shadow so it reads on any image.
3. NISA insight line (AIInsightLine in B): no tinted box and no orb. A 2px
   --ob-primary rule on the left, a small "NISA" label (10 to 11px, medium,
   slight letter spacing, --ob-primary-strong), the sentence in
   --ob-text-strong at 13px that may wrap to 2 lines, and "Ask NISA" as a
   link at the end of the sentence. Keep the full text on hover where the
   component already supports it.
4. Filter chips (FilterChip, Owner / Type / Mode / Sort), the search field,
   pagination and the list / grid toggle: --ob-radius-control, hairline
   border, white background, no fill. Active or selected state: 1px
   --ob-primary border and --ob-primary-strong text (no tinted fill).
5. After this prompt the normalised diff against Option A must show
   ProgramScopeTabs, AIInsightLine, CourseStatus, FilterChip, the pagination
   component and CourseFilterTabs as changed files.
```


## B7: Page fixes for Upskill and Analytics (Option B)

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Option A, Option C and everything
under src/ outside src/variants/b/ must stay unchanged. Pages:
/b/ld/dashboard, /b/ld/analytics/course, /b/ld/learning-management/courses

Checklist: docs/upskill-studio/checklist.csv, rows B7-01 to B7-05. Work through them
in order. When a row is finished set Status to "Done", Done on to today's
date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be done set
"Blocked" and say why. Keep the CSV valid.

Style only: do not change any content, label, number or section. Colours
only through the --ob-* variables in src/variants/b/option-b.css (mirrored in
src/variants/b/theme.ts).

Goal of B5 to B8: Option B must look clearly different from Option A while
being one consistent style across its three pages. Today B is "Option A
without cards": 21 files are identical to A and the shared components (pill
tabs, filled status pills, the tinted insight row, pill filters and
pagination) look exactly like A. Option B's own language is: frameless
sections split by hairlines, Inter for text with Geist Mono for numbers,
squarer shapes, underline tabs, outlined status tags, a left-rule NISA
insight line, blue as the one accent and orange only for attention.

Upskill Studio (/b/ld/learning-management/courses):
1. Review strip: remove the blue band and blue icon. Make it a hairline
   section with a 2px orange (--ob-attention-bar) rule on the left, because
   it is waiting on the current user: "1 course waiting for your review" in
   --ob-text-strong, the meta line muted, and the existing 3D secondary
   "Review" button on the right.
2. Course table: the "waiting for another admin" subline is --ob-text-muted,
   not link blue. Column headers 11px, --ob-text-muted, letter-spacing
   0.04em.

Analytics (/b/ld/analytics/course):
3. KPI row: value, unit and trend sit on one line for every KPI; "88 per
   course" no longer pushes its trend to a second line (shorten spacing or
   put the unit under the value consistently for all five).
4. Top and Bottom courses: course names wrap to 2 lines instead of being
   cut off; the metadata line sits under the name in muted 12px.
5. Recent learner feedback: low scores in --ob-attention-text, all other
   scores neutral (one attention colour, no red). Courses by mode: make the
   donut ring thinner (about 10px) with small gaps between segments, to
   match the thin tick gauge.
```


## B8: Option B QA against Option A

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Option A, Option C and everything
under src/ outside src/variants/b/ must stay unchanged. Pages:
/b/ld/dashboard, /b/ld/analytics/course, /b/ld/learning-management/courses

Checklist: docs/upskill-studio/checklist.csv, rows B8-01 to B8-02. Work through them
in order. When a row is finished set Status to "Done", Done on to today's
date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be done set
"Blocked" and say why. Keep the CSV valid.

Style only: do not change any content, label, number or section. Colours
only through the --ob-* variables in src/variants/b/option-b.css (mirrored in
src/variants/b/theme.ts).

Goal of B5 to B8: Option B must look clearly different from Option A while
being one consistent style across its three pages. Today B is "Option A
without cards": 21 files are identical to A and the shared components (pill
tabs, filled status pills, the tinted insight row, pill filters and
pagination) look exactly like A. Option B's own language is: frameless
sections split by hairlines, Inter for text with Geist Mono for numbers,
squarer shapes, underline tabs, outlined status tags, a left-rule NISA
insight line, blue as the one accent and orange only for attention.

1. Open each page in Option A and Option B at 1440 and 1280 px wide and
   compare: tabs (underline vs pill), status (outlined vs filled), insight
   line (left rule vs tinted row), numbers (Geist Mono vs DM Sans), control
   shapes (6px vs pill), bars (2px corners vs round). Note any spot where B
   still looks like A and fix it in B.
2. grep src/variants/b: no import from src/variants/a, no hex in
   components, no rounded-full on controls (avatars excepted). No content
   changed. /a/... pages look exactly as before. npm run build passes.
   Reply with a short list of what now differs from A on each page.
```


## B9: Final consistency pass for Option B

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Option A, Option C and everything
under src/ outside src/variants/b/ must stay unchanged. Pages:
/b/ld/dashboard, /b/ld/analytics/course, /b/ld/learning-management/courses

Checklist: docs/upskill-studio/checklist.csv, rows B9-01 to B9-07. Work
through them in order. When a row is finished set Status to "Done", Done on
to today's date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be
done set "Blocked" and say why. Keep the CSV valid.

Style only: do not change any content, label, number or section. Colours
only through the --ob-* variables in src/variants/b/option-b.css (mirrored in
src/variants/b/theme.ts). Keep Option B's language: frameless sections,
hairlines, underline tabs, outlined tags, Geist Mono numbers, 6px controls,
8px buttons, blue as the one accent, orange only for attention.

1. Learning funnel (src/variants/b/pages/ld/analytics/course/components/
   LearningProgressFunnel.tsx) is green today, while the Courses by mode
   donut next to it and Home's Learning mode analytics are blue. Make it
   blue: Blended = --ob-primary, Self-paced = --ob-mode-self (the pale blue),
   in the ribbon layers, its left fade, the legend and the dots in the table.
   Then grep src/variants/b for any other green used as a mode or category
   colour and switch it to the blue pair. Green stays only on positive trend
   pills.
2. Review button: the review strip uses the 3D secondary button, the course
   card footer uses a tinted blue pill. Make the card footer's Review the same
   3D secondary button (8px corners, same height and padding as in the
   strip). No tinted blue fill anywhere for buttons.
3. Avatar and badge shapes, one rule:
   - People are circles: owner initials, avatar stacks, the top bar avatar,
     and the trainee initials in Recent learner feedback (square today).
   - Things that are not people are 6px rounded squares: license initials
     (OR, in, LX, Co, MS), rank numbers in Top and Bottom courses, and the
     IconCircle in components/ui/kit.tsx.
4. Program overview chart on Home: bars get 4px top corners and a square
   bottom instead of full pill shapes. Keep the grey bars and the blue
   gradient highlight as they are.
5. Sidebar (src/variants/b/components/Sidebar.tsx): the active item has no
   tinted background. Show it with a 2px --ob-primary bar on the left edge,
   --ob-text-strong label and a --ob-primary icon. Sub-items (Upskill under
   Programs, Learning program under Analytics) follow the same rule. Hover:
   --ob-surface-subtle background, 6px corners.
6. Upskill course grid: 4 columns from 1440 px, 3 columns from 1024 px, 2 from
   768 px, 1 below, so the meta row (version, hours, mode) is never cut off.
7. Verify all three pages at 1440 and 1280 px wide: no green mode colour, one
   Review style, shapes follow the avatar rule, square-cornered chart bars,
   new sidebar active state, no truncated card meta. /a/... pages look
   exactly as before and npm run build passes. Reply with the files you
   touched.
```


---

# Option B: pixel audit fixes (B10 to B12) and round badges (X1)


## B10: Lines, radius, colour and type (audit sections 1 to 4)

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Everything else under src/ must stay unchanged. Pages:
/b/ld/dashboard, /b/ld/analytics/course, /b/ld/learning-management/courses

First read docs/upskill-studio/option-b-audit.md: section 0 is the Option B
standard, the numbered findings are what this prompt fixes.

Checklist: docs/upskill-studio/checklist.csv, rows B10-01 to B10-05. Work through them
in order. When a row is finished set Status to "Done", Done on to today's
date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be done set
"Blocked" and say why. Keep the CSV valid.

Style only: do not change any content, label, number or section. Colours
only through --ob-* variables in src/variants/b/option-b.css (mirrored in
src/variants/b/theme.ts). Add a token rather than a hardcoded value.

1. Lines (audit 1): keep exactly two line levels. Section rules and the
   column divider: 1px --ob-border. Inner lines: 1px --ob-border-subtle,
   horizontal only. In Recent learner feedback remove the vertical lines
   between cells. The Division benchmark becomes an SVG or CSS line with a
   4 4 dash in --ob-text-subtle (same pattern as chart grid lines). On Home,
   make sure the vertical column divider is drawn once.
2. Radius (audit 2): set --ob-radius-button to 8px and use it for every 3D
   button (Create course, Review, top bar icon buttons, the NISA button).
   Legend marks: 8px squares with 2px corners on every chart. Profile photo:
   12px corners.
3. Neutral fills (audit 3.1, 3.2, 3.4): add --ob-track and use it for every
   progress track and empty or unselected bar (Program overview grey bars,
   Division tracks, license rows, MetricTile tracks, attendance and hours).
   Remove HATCHED_TRACK from Division. Replace the pastel avatar colours in
   the Active programs stack with --ob-surface avatars and --ob-text-body
   initials.
4. NISA button (audit 3.5, 7.1): on the blue NISA section use a white button
   (or white at 14% with a 1px white 30% ring) with --ob-primary-strong or
   white text, 8px corners, 40px tall.
5. Typography (audit 4, except 4.5):
   - Stat labels everywhere: Inter 13px/18px --ob-text-muted (a picked
     MetricTile label --ob-text-strong).
   - Units next to values always small: Inter 13px 600 --ob-text-muted
     (KPI "68%" and Analytics "76%" included).
   - Geist Mono values 20px and up: letter-spacing -0.02em; below 20px
     normal. Donut centre 30px.
   - Initials 11px everywhere. 12px text: line-height 16px for captions,
     20px for list text. Footer copyright 12px.
```


## B11: Charts (audit section 6 and 3.3, 3.6)

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Everything else under src/ must stay unchanged. Pages:
/b/ld/dashboard, /b/ld/analytics/course, /b/ld/learning-management/courses

First read docs/upskill-studio/option-b-audit.md: section 0 is the Option B
standard, the numbered findings are what this prompt fixes.

Checklist: docs/upskill-studio/checklist.csv, rows B11-01 to B11-04. Work through them
in order. When a row is finished set Status to "Done", Done on to today's
date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be done set
"Blocked" and say why. Keep the CSV valid.

Style only: do not change any content, label, number or section. Colours
only through --ob-* variables in src/variants/b/option-b.css (mirrored in
src/variants/b/theme.ts). Add a token rather than a hardcoded value.

Shared helpers live in src/variants/b/components/ui/chart.tsx; put new
rules there so every chart uses them.

1. Grid: bar and line charts show horizontal dashed grid lines (GRID_PROPS:
   4 4, --ob-border) at their axis ticks. Add them to the Program overview
   bar chart.
2. Fills: data marks are solid --ob-primary (or --ob-mode-self for
   Self-paced). A gradient is allowed only on the one highlighted mark of a
   chart (the selected Program overview bar). Remove the other gradients:
   Division bars, MetricTile bars, attendance bar (GradientProgress), donut
   segments (solid mode colours) and the funnel bands (solid layers; the
   left fade-in can stay). Add one helper for the highlight gradient so its
   direction is always the same.
3. Tooltips: show ChartTooltipCard on hover for Program overview bars, the
   Division bars, the funnel stages and the gauge, with the same look as the
   Completion over time tooltip.
4. Labels and legends:
   - Data labels are plain 12px text, no box and no shadow. The funnel count
     and conversion pills keep their white box but swap the drop shadow for
     a 1px --ob-border ring.
   - One legend mark component (8px square, 2px corners) on Home and
     Analytics.
   - Division value labels use --ob-text-body (axis ticks stay
     --ob-text-subtle).
   - Self-paced line in Completion over time: --ob-primary-300; the pale
     tint stays for its area fill only.
```


## B12: Icons, table headers and final check (audit sections 5, 4.5)

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option B (src/variants/b/). Everything else under src/ must stay unchanged. Pages:
/b/ld/dashboard, /b/ld/analytics/course, /b/ld/learning-management/courses

First read docs/upskill-studio/option-b-audit.md: section 0 is the Option B
standard, the numbered findings are what this prompt fixes.

Checklist: docs/upskill-studio/checklist.csv, rows B12-01 to B12-03. Work through them
in order. When a row is finished set Status to "Done", Done on to today's
date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be done set
"Blocked" and say why. Keep the CSV valid.

Style only: do not change any content, label, number or section. Colours
only through --ob-* variables in src/variants/b/option-b.css (mirrored in
src/variants/b/theme.ts). Add a token rather than a hardcoded value.

1. Icons (audit 5):
   - Rule: filled icons for objects and navigation (sidebar, top bar,
     profile contacts, tile icons, card meta), outline 1.5 icons for actions
     and direction (chevrons, arrows, kebab, search, sort, view toggle, Ask
     NISA arrow). Fix every icon that breaks the rule.
   - Sizes: 14px inline meta, 16px controls and kebabs (list and grid
     kebabs both 16px), 18px navigation and top bar. The 12 and 13px
     chevrons and arrows become 14px. The 8px trend triangle stays.
   - Colours: --ob-text-muted for inline icons, --ob-text-strong for the top
     bar, --ob-primary for active or picked states. No #A4A7AE or #414651
     icon greys left.
2. Table headers (audit 4.5): one style on every column of the Upskill
   table, the Recent learner feedback table and the funnel table: Inter
   11px/16px, --ob-text-muted, letter-spacing 0.04em. Sort icons 14px outline.
3. Verify all three pages at 1440 and 1280 px. Re-measure with a small
   console script (computed styles of borders, radii, fonts, icons) and list
   any remaining exception in the Notes. Options A, C and D look exactly as
   before; npm run build passes.
```


## X1: Round profile badges (Options B and D)

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Options B and D (src/variants/b/ and src/variants/d/). Everything else under src/ must stay unchanged. Pages:
/b/ld/dashboard, /b/ld/analytics/course, /b/ld/learning-management/courses

First read docs/upskill-studio/option-b-audit.md: section 0 is the Option B
standard, the numbered findings are what this prompt fixes.

Checklist: docs/upskill-studio/checklist.csv, rows X1-01 to X1-02. Work through them
in order. When a row is finished set Status to "Done", Done on to today's
date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be done set
"Blocked" and say why. Keep the CSV valid.

Style only: do not change any content, label, number or section. Colours
only through --ob-* variables in src/variants/b/option-b.css (mirrored in
src/variants/b/theme.ts). Add a token rather than a hardcoded value.

The achievement badges in the profile (components/ui/profile-badges.tsx in
Option B and Option D) are hexagons. Make them circles in both options.

1. Replace the hexagon path with a circle in the same drawing space, so each
   badge keeps its size, vertical gradient fill, white radial glow, white
   edge highlight (now a circle stroke) and drop shadow. The medal, star and
   trophy icons stay centred inside.
2. The "5+" stack becomes three overlapping circles with the same offsets.
3. Option B only: map the badge tones in OB_BADGES to Option B's blue scale
   (--ob-primary family), no purple or cyan. Option D keeps its own colours.
4. Check Home in Option B and Option D at 1440 px: round badges, same size and
   position as before. Options A and C unchanged; npm run build passes.
```


---

# Option C

## C1: Course card in the reference style

```
Project: Vite + React + Tailwind demo of three L&D admin pages. This prompt
only touches Option C (src/variants/c/). Options A, B, D and everything
under src/ outside src/variants/c/ must stay unchanged. Page:
/c/ld/learning-management/courses (grid view). Main file:
src/variants/c/pages/ld/learning_management/courses/components/CourseCard.tsx

Checklist: docs/upskill-studio/checklist.csv, rows C1-01 to C1-07. Work
through them in order. When a row is finished set Status to "Done", Done on
to today's date (YYYY-MM-DD) and a one-line Notes entry; if a row can't be
done set "Blocked" and say why. Keep the CSV valid.

Style only: keep every piece of content the card shows today (status, title,
description, owner, updated time, version and draft, hours, mode, the
status footer data, the kebab menu actions). Colours only through the --oc-*
variables in src/variants/c/option-c.css (add tokens there if needed).

Reference look: a white card with big soft corners and a wide, very soft
shadow on a light grey page; small ink (near-black) pills with a subtle 3D
finish; a light (regular weight) title with grey text under it; a photo with
large rounded corners carrying white text on top; a thick pill progress bar
with the value inside and a white round knob. Ink is Option C's interaction
colour; sky blue (--oc-primary) is for data.

1. Card shell: white, 26px corners, 14px padding, 1px --oc-border hairline
   and a wide, very soft drop shadow (for example 0 24px 48px -28px
   rgba(10, 25, 41, 0.18)). In the grid the cards sit directly on the page
   background: remove the white library container behind the grid (keep its
   header, tabs and filters, just without the card frame around the cards).
2. Top row:
   - Status pill on the left: ink background (--oc-text-ink), white 11px
     label, 9px corners, 3D finish (a soft top-to-bottom gradient from a
     slightly lighter ink, a 1px white inner highlight at the top and a small
     drop shadow). Draft and Inactive use a white pill with a 1px ink border
     and ink text instead.
   - Date pill on the right: two parts in one 9px-cornered pill with an ink
     border, month in ink with white text ("OCT"), day in white with ink text
     ("22"). It shows the last-updated date.
3. Text block: title at 18px, regular weight (400), --oc-text-strong, fixed
   height for 2 lines with clamp. Description at 12px, line-height 1.5,
   --oc-text-subtle, fixed height for 2 lines with clamp.
4. Photo: below the text, full card width inside the padding, about 120px
   tall at 1440px, 20px corners. Add a dark fade at the bottom and put white
   text on it, bottom left: a small person icon and the owner ("M. Torres",
   "You") on line 1, and "type · mode · hours" (or the version and "+1
   draft" for courses with a draft) on line 2 at 80% opacity. This replaces
   the old meta row. Move the kebab menu to a white 30px icon button with
   the 3D finish at the photo's top right.
5. Status footer under the photo (12px label row above, --oc-text-muted):
   - Active: label "Completion" left and "N enrolled" right, then a 30px tall
     fully rounded progress bar: track --oc-surface, fill --oc-primary, the
     percentage in white 11px inside the fill near its end, and a 22px white
     round knob at the end of the fill (subtle inner shadow).
   - In review, owned by someone else: label "Waiting for your review" and
     "Starts in N days", then a full-width 38px ink 3D "Review" button.
   - In review, owned by the current user: label "Waiting for another admin"
     and the start date, no button.
   - Draft: label "Sections ready" and "4 of 6", the same pill bar with an
     ink fill and "4/6" inside.
   - Approved: label "Starts 3 Nov" and "N of cap seats", the pill bar in
     --oc-primary for seats filled.
   - Needs revision: "N reviewer comments" in --oc-attention-text and the
     first comment in quotes, one line.
   - Inactive: the whole card at reduced emphasis (muted text, photo
     desaturated), label "Ended d Mon" and completed count, a secondary
     "Run again" button.
   All footers have the same height so every card in a row ends on the same
   line.
6. Grid: 3 columns from 1280px, 2 from 768px, 1 below, 16px gaps. Hover: the
   card rises 2px and the shadow gets a little stronger (200ms). Clicking the
   card opens the course; the kebab and buttons don't trigger it.
7. Verify at 1440, 1280 and 375 px wide in every status tab. Options A, B
   and D look exactly as before. npm run build passes. Reply with the files
   you touched.
```
