# Concepts (not rendered)

Pieces kept for other options. Nothing here is imported by a page.

## ProfileHeroCard

The profile card whose cut-out photo rises above the card ("the head pops
out"). It was Option C's Home header before the greeting row replaced it.

```tsx
import { ProfileHeroCard, PROFILE_HEADROOM } from '@/variants/c/concepts/ProfileHeroCard';

<ProfileHeroCard person={MOCK_LD_PROFILE} />
```

Placing it the way Home did:

- The card adds `PROFILE_HEADROOM` (28px) of empty space above itself for
  the head. To pull that space into the empty left part of the top bar row,
  give the page content a negative top margin (Home used `-mt-7`).
- A column next to it should start level with the card, not with the head:
  give that column `padding-top: PROFILE_HEADROOM` on large screens.
- The photo column is `PROFILE_PHOTO_WIDTH` (220px). Pass `photo` for
  another person; it needs a transparent background (the current one is
  `src/variants/c/assets/profile-cutout.png`).
- Colours use the Option C `--oc-*` tokens. In another option, swap them for
  that option's tokens or values.
