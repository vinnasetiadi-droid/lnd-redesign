# Option B: detailed style audit (23 Oct 2026)

Measured on /b/ld/dashboard, /b/ld/analytics/course and
/b/ld/learning-management/courses (list and grid) at 1440 x 900 with a script
that reads the computed style of every element (colour, border, radius, font,
icon, SVG chart element), plus screenshots and a read of the chart code.
Content is out of scope: only style. Values in brackets are what the page
renders today.

The goal: one Option B standard, applied the same way on all three pages.
Each finding says what is inconsistent and what the standard should be.

---

## 0. The Option B standard (target)

| Area | Standard |
|---|---|
| Section line (level 1) | 1px solid --ob-border (#EDEEF1), edge to edge in its column |
| Inner line (level 2) | 1px solid --ob-border-subtle (#F1F2F5), horizontal only, inset to content |
| Chart reference line | 1px dashed 4 4, --ob-border for grid, --ob-text-subtle for a benchmark |
| Radius | 2px bars and tracks, 6px controls, tags, inputs, legend marks, 8px buttons, 12px photo and cards |
| Neutral fills | track and empty bar: one token (--ob-track); surface: --ob-surface; nothing else |
| Accent | --ob-primary solid for data; one gradient direction only (see charts) |
| Stat label | Inter 13px/18px, --ob-text-muted |
| Stat value | Geist Mono 600: 30px KPI and hero (gauge, donut), 24px tile, 20px card footer; letter-spacing -0.02em from 20px up |
| Unit next to a value | Inter 13px 600 --ob-text-muted, always small (%, h, per course, / 5) |
| Caption | Inter 12px/16px --ob-text-muted |
| Table header | Inter 11px/16px, --ob-text-muted, letter-spacing 0.04em, every column |
| Table cell | Inter 13px/20px; numbers Geist Mono 13px |
| Initials | 11px, people in circles, non-people in 6px squares |
| Icons | filled = objects and navigation; outline 1.5 = actions and direction (chevron, arrow, kebab, search, sort, view toggle). Sizes: 14px inline meta, 16px controls, 18px navigation and top bar. Colour: --ob-text-muted inline, --ob-text-strong or --ob-primary when active |
| Chart axis | 11px --ob-text-subtle; words Inter, numbers Geist Mono |
| Chart data label | 12px, no box and no shadow |
| Tooltip | ChartTooltipCard on every chart |
| Legend mark | 8px square, 2px radius |

---

## 1. Lines and outlines

1. Three different "light grey line" values are in use with no clear rule:
   section rules and the column divider [#EDEEF1], inner rows and grid card
   lines [#F1F2F5], and the Division benchmark [dashed #A4A7AE]. Keep the
   two levels above and give the benchmark the chart dash pattern.
2. Division benchmark uses CSS `border-dashed` (browser dash, about 3px) while
   chart grid lines use `4 4`. Same dash pattern for both.
3. Recent learner feedback table draws vertical lines between every cell
   [55 left borders], while the Upskill table, the funnel table and all lists
   use horizontal row lines only. Remove the vertical cell lines.
4. Home shows two vertical left borders in the column area [#F1F2F5 and
   #EDEEF1]. Check that the column divider is drawn once, in --ob-border.
5. NISA section separators use white at 15%; fine on blue, keep.

## 2. Radius

1. 3D buttons (Create course, Review, top bar icon buttons, "More insights?
   Just ask NISA") render at 14px, not the 8px standard. Controls next to them
   are 6px, so buttons look much rounder than everything else.
2. Analytics legend marks are 10px squares with 3px corners; Home legends are
   8px circles. Use 8px squares, 2px corners, everywhere.
3. Profile photo 16px; use 12px (card radius).
4. Tab buttons carry 6px 6px 0 0 corners for their hover state; fine, keep.

## 3. Colour

1. Five near-identical light greys for tracks and fills: progress tracks
   [#E4E6EA], Program overview bars [#F0F1F3], surfaces and legend [#F5F6F8],
   borders and key cap [#EDEEF1], subtle lines [#F1F2F5]. Use one --ob-track
   for every track and empty bar, --ob-surface for surfaces, the two line
   tokens for lines.
2. Off-palette pastels in the Active programs avatar stack: pink #FCE7F6,
   lilac #E9D7FE, peach #FFE4D5, cyan #CFF9FE. Use neutral --ob-surface
   avatars (or one blue tint) in Option B.
3. Gradient directions disagree: Division bars go light to dark (left pale,
   right blue), attendance bar and MetricTile bars go dark to light, the donut
   is diagonal, the funnel is light to dark, the selected Program overview
   bar is vertical. Standard: data marks are solid --ob-primary; a gradient is
   used only for the one highlighted mark per chart (selected bar), always
   light at the far end from the value start.
4. Hatched track appears only under the Division bars (HATCHED_TRACK). Use the
   plain --ob-track like every other bar.
5. "More insights? Just ask NISA" is a blue 3D primary button on the blue NISA
   section: blue on blue, weak edge. Use a white or translucent-white button
   with blue text on the blue section.
6. Self-paced line in Completion over time is #AECBFA on white (very low
   contrast). Use --ob-primary-300 (#8AB4F8) for the line and keep the pale
   tint for fills and areas only.
7. Profile badges use purple, blue and cyan glossy gradients (OB_BADGES).
   Option B's accent is blue: map the badge tones to the blue scale.

## 4. Typography

1. Stat labels come in four styles: KPI [13px #717680], metric tiles [12px,
   #181D27 when picked, #717680 otherwise], Learning mode stats [13px
   #535862], Division "Org average" [12px #181D27]. Use the stat label
   standard (13px --ob-text-muted; picked tile label --ob-text-strong).
2. Units are treated three ways: the KPI "68%" shows % at full size in mono,
   Learning mode "88%" and the gauge "20%" show a small Inter % [13px 600],
   Analytics KPI "76%" full size. Standard: unit always small.
3. Mono tracking is uneven: some 24px values at -0.48px, others normal; KPI
   30px normal but its % at -0.6px. Apply -0.02em to every Geist Mono value
   20px and up, normal below.
4. Donut centre "64" is 32px; the scale is 30px for hero numbers.
5. Upskill table header mixes sizes in one row: "Course" and "Enrolled" at
   13px, "Status" and "Owner" at 11px. Analytics feedback headers are 13px with
   sort icons, the funnel table header 12px. One table header style.
6. Initials: avatar stack 10px, license and owner 11px, feedback 12px. Use 11px.
7. 12px text uses line-heights 16, 18 and 20px. Use 16px for captions, 20px
   for list text.
8. Footer copyright 10px next to 12px links; use 12px.

## 5. Icons

1. Filled and outline icons are mixed without a rule (filled: sidebar, top
   bar, profile contacts, tile icons, card meta; outline: chevrons, arrows,
   search, kebab, sort, view toggle). Keep both, but by the rule in the
   standard: objects and navigation filled, actions and direction outline.
   Check every icon against it (for example Analytics header and card icons).
2. Six icon sizes are in use (8, 12, 13, 14, 16, 18px). Standard: 14 inline
   meta, 16 controls, 18 navigation and top bar; the 8px trend triangle stays.
   The 12 and 13px chevrons and arrows go to 14px.
3. Four icon greys: #A4A7AE (contacts, unpicked tiles), #717680 (meta,
   chevrons), #414651 (kebab, view toggle), #181D27 (top bar). Use
   --ob-text-muted for inline icons and --ob-text-strong for top bar and
   active states.
4. The list kebab is 18px, the grid card kebab 16px. Same 16px.

## 6. Charts

1. Grid lines differ per chart: Completion over time has dashed 4 4 lines,
   Program overview has none, Division has only the benchmark, the donut and
   funnel none. Standard: bar and line charts show horizontal dashed 4 4 grid
   lines in --ob-border at their axis ticks (Program overview included).
2. Tooltips exist only on Completion over time and the donut. Add the same
   ChartTooltipCard on hover to Program overview bars, Division bars, the
   funnel stages, the gauge and the license rows' bars where it makes sense.
3. Data labels: Program overview "36 participants" is plain text, the funnel
   count and conversion pills are white boxes with a drop shadow (the only
   shadow on any chart), the Learning mode end labels are coloured text.
   Standard: plain 12px labels; if a label needs a box (funnel), use a white
   box with a hairline border, no shadow.
4. Bar shapes: Program overview columns 4px top corners, Division bars 4px tall
   with gradient and hatched track, progress bars 4px flat, donut segments 3px
   corners with 2px gaps, gauge ticks round caps. Keep the shapes, but bars
   share one track colour, solid fill, and the single-highlight rule.
5. Legends: Home uses 8px circles, Analytics 10px squares. One legend mark.
6. Line chart: 2px lines, end dots 5px with a 2px white ring, active dot 4px.
   Keep; apply the Self-paced line colour from 3.6.
7. Value columns next to bars (Division) are 12px muted mono while the axis is
   11px subtle mono. Keep the difference but make value labels --ob-text-body
   so they read as data, not as axis.

## 7. Buttons and controls

1. Heights: buttons 40px, the NISA button 44px, filter chips and tabs 32px,
   search 40px. Buttons 40px everywhere (NISA included).
2. Top bar icon buttons are 14px squares while the avatar is a circle; with the
   8px button radius they become 8px squares.

## 8. Profile badges (requested)

Replace the hexagon badges with circles in every option that has them
(Option B and Option D). Keep the size, gradient, glow, edge highlight, drop
shadow, the medal, star and trophy icons and the "5+" stack (overlapping
circles). Option B maps the badge tones to its blue scale; Option D keeps its
own colours.
