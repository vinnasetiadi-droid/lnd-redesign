# Option A build kit: Home cleanup + Upskill Studio

- `checklist.csv`: one row per task (open in Numbers, Excel or Google Sheets). Claude Code updates the Status, Done on and Notes columns as it works.
- `prompts.md`: one prompt per Claude Code session. Run them in order: H1, H2, U0, U1, U2, U3, U4, U5, U6, U7. The Analytics visual pass (A1 to A5) is separate: run it after U0, in order.

How to run a step: open Claude Code in this project folder, paste one prompt from `prompts.md`, let it finish, then check its rows in `checklist.csv` and the page in the browser before moving to the next prompt.

Open product questions (decide before U1 if possible):
1. Can an admin approve a course they created? The kit assumes no.
2. Is "Approved" different from "Active"? The kit assumes Approved = signed off but not started yet.
3. Do drafts track section completeness, reviewer comments and seat capacity in the real platform? If not, the card footers fall back to simpler info.

Option B: B1 (one accent colour), B2 (section rhythm), B3 (compact profile) and B4 (orange attention colour, sticky right column) are standalone style prompts at the end of `prompts.md`. Run them in that order.
B5 to B8 give Option B its own identity (foundations, components, page fixes, QA). Run them in order after B4.
B9 is the final consistency pass for Option B (run after B8).
B10 to B12 fix the findings in option-b-audit.md. X1 makes the profile badges round in Options B and D.
Option C: C1 restyles the course card after the reference images.
