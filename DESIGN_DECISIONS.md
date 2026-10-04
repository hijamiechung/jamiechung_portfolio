# DESIGN_DECISIONS.md

See [`CLAUDE.md`](./CLAUDE.md) for how these decisions get implemented and
iterated on, and [`docs/figma-reference.md`](./docs/figma-reference.md) for
Figma file/page/node references.

Current state of the design. This is a snapshot of what's decided, not a
changelog — update entries in place as decisions evolve; don't append a
running log of minor tuning (see `CLAUDE.md`'s "What requires approval"
section for that boundary).

**Status legend:** **Settled** (treat as fixed unless explicitly reopened) ·
**Experimental** (prototype and judge in-browser before any permanence) ·
**Pending** (approved as a starting point, expected to be revisited).

## Canonical visual reference (Settled direction / Pending final content)

`reference/Claudedesign_v1/Portfolio.dc.html` and its Design System are the
canonical visual and interaction reference, explicitly selected on 2026-09-08.
Port their composition and behavior closely; do not reinterpret them as loose
inspiration. Preserve the reference files unchanged. This supersedes the earlier
Figma visual values; Figma remains historical context. The approved visual
reference is the **dark/clay direction**, with **Neue Montreal** typography.
The export's bright initial state is not the approved reference. Its editor
metadata includes `clay`, but the runtime only ever defined Bone/Moss/Signal/Char;
Char was the available dark palette used for the initial implementation, and
its exact equivalence to the approved Clay screenshot remains unverified. As
of 2026-09-08, only two themes are user-facing (Light/Dark, see "Color
tokens" below) — Char's values seeded `data-theme="dark"` but have since
been revised (see "Color tokens"). What's approved from the running site is
its composition, proportions, and interaction structure — the color values
specifically are still open and iterating, not a locked decision tied to
the reference's original Char/Bone hex values.

The Next.js port retains App Router, CSS Modules, semantic tokens, data-driven
cards, and independent navigation/footer components. Prototype project narratives,
metadata, and homepage introduction remain provisional in `lib/projects.ts`.
Project detail pages identify this status; none of their claims are verified.
The sidebar's Archive row expands (same disclosure pattern as Projects) to five
internal pages at `/archive/[slug]` (`lib/archive.ts`), reusing the generic
project-detail layout. Content — copy, metadata, images — is migrated in from
Jamie's original Framer pages (earlier CMU coursework and personal
explorations), not invented; images are downloaded locally rather than
hotlinked. One known gap: the "Human Factors" page's source had a sentence
cut off mid-thought in its Background section ("filmed on campus, late at
night, to reflect the physical and"); it was trimmed at the last complete
sentence rather than guessed at — worth finishing from the original if Jamie
remembers how it ended.

## Concept

AI-interface structure + Jamie as the human presence, expressed through
small, authored digital detail rather than decoration or simulated
imperfection.

## Principles (Settled)

1. Restraint signals craft, not absence of effort.
2. Borrow the grammar of an AI interface — never its identity.
3. Nothing sits inert, but almost everything stays visually still at rest.
4. Content is the protagonist.
5. Human-authored means deliberately designed, not deliberately imperfect.
6. Pixel/dot/ASCII-adjacent qualities are used selectively (identity, rare
   state changes) — never a site-wide skin.
7. The interface is silent; visual feedback carries interaction states.

## Layout (Settled reference / Pending browser tuning)

- Sticky 260px sidebar card, collapsed 64px rail, inset 8px from the left/top/bottom
  with a 16px radius; bottom-pinned Connect and profile.
- Home: 88px top, 56px horizontal, 120px bottom padding; 940px content maximum.
- Removed the “Rather ask a question?” link by request; Ask Jamie remains
  accessible through the sidebar profile. **Revised 2026-09-11:** the
  introductory tagline was reinstated by request, now as the page's primary
  heading (replacing the plain "Projects" label) rather than a secondary line
  under it — "I untangle complex systems for the people living inside them."
  with "I'm especially interested in the parts of human life those systems
  struggle to represent." as the description beneath. Content is provisional
  like the rest of the homepage introduction (see `lib/projects.ts` note above).
- Two featured cards, 24px gap, 4:3 dotted image placeholders, 14px card padding,
  16px card radius, and 2px upward hover movement.
- Desktop-first; use the prototype's fluid grid without inventing mobile layouts.
- Sidebar collapse/expand: every element that hides when collapsed (`:J`
  logo, nav row labels, the Projects chevron/nested list, Connect's label,
  the profile's name/role/arrow, the theme controls block) now fades
  and shrinks via `max-width`/`max-height` + `opacity` transitions timed with
  the sidebar's own 420ms width animation, instead of an instant
  `display:none` — so nothing pops. The header's `gap` and `padding-right`
  are also transitioned (not just held constant) so the reopen-rail button's
  left edge lands exactly on the same column as the nav/Connect icons below
  it once collapsed, rather than staying pinned to the far-right corner.
  Fixed 2026-09-08 after the collapsed-header treatment introduced a visible
  jump and the toggle icon didn't line up with the rail below it.
- When the sidebar is collapsed, the main content area (`.content` in
  `app/layout.module.css`) gets a 1240px max-width with `margin-inline:auto`
  via a sibling selector off `aside[data-collapsed="true"]`, so it recenters
  in the freed-up space instead of hugging the left edge with a large empty
  gutter on the right. Expanded-state composition is untouched.

## Components / IA (Settled)

- `ProjectCard`: image above title/year and description; two featured cards,
  each carrying a small "Featured" kicker label (uppercase, no pill/border/
  background — purely typographic) above the title, kept separate from the
  existing category tag pill on the thumbnail.
- Project cards and sidebar links navigate to `/projects/[slug]`. Detail pages
  reproduce the overview, metadata, image slots, narrative sections, sticky
  section index, and next-project link. All case-study text remains provisional.
- Connect is a separate row above the JC profile, matching Claude Design. It opens
  LinkedIn, Medium, Email, and disabled Resume links, each with a small
  function-based line icon (briefcase / pencil / envelope / document) rather
  than brand social-logo marks, matching the rest of the sidebar's icon
  vocabulary. Existing real destinations: `linkedin.com/in/hijamiechung`,
  `medium.com/@jamie_chung`, and `mailto:hi.jamiechung@gmail.com`. Resume has
  no destination yet. The popover opens anchored directly above the Connect
  trigger (not offset to match the prototype's different DOM structure).
- No Chat History feature. JC monogram replaces the photo for this visual port.
- Collapsed sidebar rail shows only the panel-toggle control — the `:J` logo
  mark is hidden entirely while collapsed, not just its label.
- **Revised 2026-09-10:** thumbnail/hero image slots (`ProjectCard`, detail-page
  hero and images) dropped their radial-gradient dot-grid placeholder texture —
  it read as generic template filler. They're flat `--color-surface-thumbnail`/
  `--color-surface-card` fills until real project imagery replaces them.

## Ask Jamie (Settled behavior / backend Pending)

- **Revised:** Ask Jamie is a separate page (`/ask`), not an inline popup
  expanding from the footer — the earlier "panel expanding upward from the
  profile area" description is superseded by this. Clicking the identity
  block navigates to `/ask`, which keeps the same persistent sidebar and
  replaces the main content area with the Ask Jamie experience.
- Because it's a page now, the Connect popover has no mutual-exclusivity
  concern with it — clicking identity simply navigates away.
- Session-ephemeral — resets on reload/leave. No persisted history, no
  localStorage.
- The visual port uses a centered welcome state, bottom composer, rotating send
  icon, and three suggestion chips. Suggestions fill the input. Submit displays
  an honest unavailable status; it does not run the prototype's keyword answers.
- The prototype's statements that answers already exist are replaced by preview
  status copy. No answer rendering or backend is implemented.
- Answers, when eventually built, must be grounded in content Jamie
  explicitly provides — never a freely-generating model.
- Backend/LLM/grounding architecture is undecided — to be designed only when
  that feature is actually built, not now.

## Typography (Settled direction / Font asset pending)

**Neue Montreal** is the intended primary typeface. The prototype's Switzer
font is an export artifact, not a design decision. Do not download or use it.
Until actual Neue Montreal files or a license-safe source are provided, use the
original fallback stack: `"Neue Montreal", -apple-system, BlinkMacSystemFont,
"Segoe UI", Helvetica, Arial, sans-serif`. No external font is loaded.

- Headline 34px; project titles 20px; sidebar 13.5px; body 13.5–14.5px.
- Ask title 28px; detail title 38px; metadata 10.5–12.5px.
- Lede (homepage intro, ask subheading, project detail lede) 17px — a distinct
  role from body text, not the same size by coincidence.
- Body tracking 0; headings, names, metadata and small labels -1%.

## Color tokens (Settled reference — not treated as final; visual identity, not a locked decision)

Only two themes are exposed to visitors — **Light** and **Dark** — via
sun/moon icon buttons in the footer controls. Moss and Signal are retired
from the UI (their `data-theme` blocks and swatch tokens removed from
`app/styles/tokens.css`). Dark is the initial theme, including before
hydration and with experiments disabled. Explicit saved choices remain
respected; theme selection is separate from any question/session data.

**Revised 2026-09-08:** the original warm-neutral Char/Bone values (visible
in the Claude Design reference and the first port) read as a generic
"AI-product dark mode" — a six-step surface ramp and five-step text ramp
with a faint warm cast, doing hierarchy work that spacing/type/borders
should carry instead. Replaced with a tighter, genuinely neutral (R=G=B)
ink/paper ramp: fewer perceptible surface and text steps, a decisive
near-black/near-white anchor rather than tinted charcoal/cream, and a
particle-field dot color deliberately decoupled from the surface ramp
(slightly cool rather than matching the warm-neutral surfaces). Token
*names* are unchanged, so no component markup needed updates — only the
hex values in `app/styles/tokens.css`. This keeps the same visual/layout
composition approved from `localhost:3001` — only the color values moved.
The palette may still be iterated on further; it is not being treated as
a final locked decision.

Dark: app `#0A0A0A`, popover `#121212`, card `#141414`, hover `#191919`,
raised hover `#202020`, thumbnail `#262626`, subtle border `#242424`,
strong border `#3A3A3A`, primary text `#EDEDED`, secondary `#AAAAAA`,
muted `#818181`, detail `#686868`, disabled `#474747`, dots `#3B3E40`.

Light: app `#F9F9F9`, popover `#FFFFFF`, card `#F1F1F1`, hover `#E9E9E9`,
raised hover `#E1E1E1`, thumbnail `#D7D7D7`, subtle border `#E1E1E1`,
strong border `#C2C2C2`, primary text `#121212`, secondary `#525252`,
muted `#787878`, detail `#8D8D8D`, disabled `#A8A8A8`, dots `#A7ABAA`.

**Revised 2026-09-10 — text/surfaces snapped to true neutral:** the dark
theme's surface ramp was already genuinely neutral (R=G=B), matching the
2026-09-08 decision above, but light-theme surfaces and every text token in
both themes had drifted to a faint warm cast (hue ~43–50° on the color
wheel) — the exact "warm cream" association the 2026-09-08 decision meant to
avoid. All surface and text values above are now R=G=B in both themes;
`--color-dot`/`--color-dot-secondary` are intentionally exempt (see below —
reserved for the particle-field experiment). Warmth now comes from the
atmosphere weather layer only, never from static UI chrome.

**Revised 2026-09-10 — `--color-dot` stays reserved for the particle field:**
it was deliberately decoupled from the warm-neutral ramp above for the
magnetic-dot particle-field experiment only. It had leaked
into two foreground UI spots it was never meant for — the Ask Jamie badge's
":J"/dots glyph and the project-page TOC's dot marker — via a CSS
specificity bug (`.badge>span` at (0,1,1) silently beat `.badgeMark`'s
(0,1,0), overriding its intended color). Both now use `--color-text-detail`,
the token already used for adjacent copy in both spots. `--color-dot` and
`--color-dot-secondary` are unchanged and remain correct for `WeatherScene.tsx`
and the project-detail thumbnail pattern; don't reach for `--color-dot` in
new foreground UI — it's the one token in this system not drawn from the
warm-neutral family.

## Sound (Removed)

Removed by request on 2026-09-09: no Sound control, stored sound preference
subscription, AudioContext, or click-to-play handler remains in the application.

## Identity — `:J` / J glyph (Experimental)

Interested in the accidental face-like quality of `:J`, specifically because
of its minimal ASCII-character quality. Must remain a subtle
typographic/pixel idea — never a literal illustrated face or mascot. Exact
glyph is not locked.

Also used, at small scale, in the Ask Jamie empty-state badge as a quiet
marker for Jamie's side of the interaction (replacing the prototype's plain
`▪▪▪` dots) — gated by the same `IDENTITY_MARK_ENABLED` flag as the sidebar
mark, so it disappears from both places together if the experiment is turned
off.

## Environment controls and magnetic-dot background (Experimental)

**Environmental light field, 2026-09-09 (experimental; awaiting visual review):**
the homepage uses one continuous viewport-scale field in
`components/experiments/atmosphere/`. Weather controls transmission, density,
occlusion and diffusion; local time controls incoming light, ambient fill and
warm/cool balance. Temperature is neither requested nor required and has been
removed from the readout. Core card layout, content, typography roles and thumbnails are preserved; the approved material and control revisions are described below.

Clear Day moves the broad daylight illumination itself over 5–10 seconds,
independently of density. Partly Cloudy intermittently obscures that light;
Overcast diffuses it; Rain and Thunderstorm increase density and directional flow.
Golden Hour uses a restrained blue-gray, dusty rose and champagne palette with irregular vertical light mixing. Clear Night uses
limited directional moonlight; Cloudy Night obscures and reveals it. The revised
reference direction now uses three separate translucent, lobed cloud bodies that
travel horizontally through the upper-middle window and obscure/reveal the
cream/ivory sunlight. Clouds are larger and higher, moving at about one third
of the former wind speed. Unequal rounded crowns replace stretched silhouettes;
cloud material fades out above the lower half. Clear daylight enters through
narrower, moving bands of illumination that widen and diffuse downward.
Clouds have finite silhouettes with gaps between them, rather than connected banks.
Rain and thunderstorms include sparse, fine 0.55px wind-slanted streaks at
substantially reduced opacity
near the top, fading gradually to zero before the middle of the screen.
Fourteen small fixed stars brighten and dim at staggered intervals at night and
fade behind density; reduced motion freezes clouds, rain and star brightness.
No cursor interaction or lightning bolts are added. Grain remains secondary. Fog and Snow retain explicit reserved
state identities, temporarily rendering with Overcast material parameters.

Time is continuous through pre-dawn, sunrise, morning, day, golden hour, dusk and
night. Sunrise structure is reserved without detailed tuning. Local sunrise/sunset
comes from the existing weather service; unavailable solar timing uses an
approximate 06:30/19:30 local schedule. Moonlight direction is authored, not an
astronomical measurement. Appearance themes adjust rendering exposure independently
of environmental time, but both themes now retain dark environmental night colors.
Exposed home headings use light text at night, while Light-mode
cards and sidebar retain their readable light material. Weather changes ease
through the same field over roughly 12 seconds; flow coordinates are retained.
Wind advects cloud bodies and density, without moving the scene. Unknown weather uses a neutral field.
Pittsburgh remains the default source; My Location remains explicitly selected
and permission-based. The Nature option and renderer were removed at the user's
request on 2026-09-10; the source menu now contains only these two weather sources.

Thunderstorm illumination occurs irregularly at 60–180 second intervals, from one
side, occasionally with a weaker secondary pulse. Accelerated 5–12 second timing
requires both a development build and the explicit `lightning=qa` preview query;
production ignores that timing override. Reduced motion freezes movement and
removes flashes, including when the preference changes during a session.

`ENABLE_ATMOSPHERE_EXPERIMENT` in `app/layout.tsx` still restores the original
particle field/radial wash when false. The particle-rendering code in
`environment.mjs` remains intact; only the shared weather adapter has changed.
The shared `glassMaterial.ts` mixes locally clear and diffused samples through
an irregular fixed refraction field. Weather moves behind
that pane; cursor focus remains disabled. Grain is restrained and secondary.
Home project cards use a 48% surface fill (56% on hover) over their image area,
reaching 84% behind the reading area, with 40px backdrop blur while this experiment is active. The CSS is scoped to the atmosphere canvas being present;
disabling it restores the original opaque card without changes in core card code.
Card geometry and text are unchanged. Thumbnail placeholders use a 20% fill so they transmit the card's blurred backdrop. Card secondary text has
a slightly stronger local color to retain readability over transmitted color.
Other routes continue using the original renderer. Weather refresh remains every
15 minutes without repeated geolocation. Preview URLs and combinations are listed
in `components/experiments/atmosphere/README.md`. These override the field only;
the readout continues reporting the selected real environmental source.

The port reproduces Pittsburgh weather and explicit My Location selection.
Weather uses the prototype's Open-Meteo endpoint with
cancellation, timeout and unavailable states. Location is requested only
after selecting My Location. No location is persisted. This remains a visual
experiment, not a permanent feature decision.

**Revised 2026-09-08:** the manual Dots on/off control was removed from the
footer — the selected background renderer runs without a visitor toggle
(still respecting `prefers-reduced-motion`). The remaining footer controls are the Light/Dark appearance toggle.

**Revised 2026-09-09:** weather and source selection share one 44px-high click
target with a 32px-high translucent pill surface, 16px SVG weather icon,
11px text, one city label, condition, and a chevron.
`WeatherIcon.tsx` replaces the active 34px animated dot scene; the old
`WeatherScene` module is retained but not mounted. Opening the source popup
focuses the selected source; Escape and selection return focus to the trigger.
Unavailable data uses a question-mark icon, and no temperature is displayed.
The home-only weather/source control sits outside the main content at the
viewport's top right, inset 24px from both edges.

Light and Dark each have a 44px click target, 18px thin icon and 8px gap.
Unselected controls are transparent; selection uses a quiet tint with a low-contrast
1px border. Keyboard focus remains visible. Sound and the controls divider are removed.
The sidebar's base material uses 68% fill / 32px blur in both themes. The active
homepage experiment uses 50% fill / 40px blur, with stronger secondary copy in
Light appearance over environmental night. The sidebar retains
8px outer spacing, 16px corners and no shadow. Decorative sidebar outlines use
an 8% primary-text tint rather than a bright surface edge.
Connect and JC share 28px icon frames and aligned labels;
Connect has a redrawn link icon and a 44px-high target.

`PrototypeExperience` owns environment effects and appearance controls. `IdentityMark` owns the :J glyph. Each has a composition-root flag in
`app/layout.tsx`, and neither is required by core components. Empty portal mounts
contribute no layout when disabled. Reduced motion disables particle animation
and cursor/card displacement.

**Revised 2026-09-10 — color-temperature logic:** the atmosphere palette's
near-white values are intentionally split by narrative family rather than
sharing one white. Light-source colors (`daylight`, `warm`, `cloud-light`) run
warm, reproducing sunlight and golden-hour light. Water/night/electricity
colors (`rain-streak`, `flash`, `moon`, `night-shadow`) run cool. Static UI
chrome (`--color-surface-app`, `--color-surface-popover`, `--color-surface-card`,
etc.) stays neutral regardless of weather — the interface does not chase the
environment's color temperature; only the translucent card/sidebar material
lets the environment show through underneath it. Within the warm family, `warm` (golden hour) originally sat off-hue from
everything else — 26° (light) / 22° (dark) on the HSL wheel, an
orange/terracotta cast, against a UI-wide amber cluster at 43–50°. Saturation
alone didn't fix it (an interim pass to `255, 215, 178` kept hue at 29°).
`warm` is now rotated onto that same ~45° hue and pulled down in saturation
to match the "restrained... champagne palette" already written above:
`255, 203, 163` → `255, 240, 195` in light theme (hue 26°→45°, delta 92→60),
`94, 62, 43` → `94, 84, 54` in dark theme (hue 22°→45°, delta 51→40). Still
visibly richer than `daylight` (hue 50°, delta 31) so golden hour keeps its
own presence — just from the same family instead of a different one.

## Magnetic-dot behavior (Experimental)

A sparse field of particles across the viewport background — a
viewport-level environmental layer, not decoration deliberately placed to
fill empty sidebar/margin space. Visible wherever background is exposed;
naturally obscured by cards and other surfaces. At rest: extremely subtle,
sparse, near-static. On cursor proximity: only nearby particles gently
attract toward the cursor and ease back on exit. Particle color is a
semantic token (not fixed black), using the selected canonical palette. Must respect `prefers-reduced-motion` and remain fully removable
(see `CLAUDE.md`'s experimental-feature isolation rule).

**Revised 2026-09-10 — turned off on non-home routes:** this had been
rendering by accident everywhere except `/` — `AtmosphereExperience` only
supplied its weather `fieldFactory` on the homepage, and `PrototypeExperience`'s
default parameter silently fell back to this particle field (`createEnvField`)
on every other route. Landing on `/ask` or a project page after the homepage's
weather glass read as two unrelated background languages, so `/ask` and the
project pages now render no background field at all. `AtmosphereExperience`
now explicitly passes a no-op field for non-home routes instead of leaving
`fieldFactory` undefined. `environment.mjs`/`createEnvField` are untouched and
still power this experiment across every route when `ENABLE_ATMOSPHERE_EXPERIMENT`
is switched off in `app/layout.tsx` (`PrototypeExperience` is then used
directly, and its own default `fieldFactory` is unchanged) — only
`AtmosphereExperience`'s own wiring changed.

## Bloom botanical material (Experimental)

The homepage's Bloom source uses the approved hand-painted daisy viewed from
below, extracted onto transparency: creamy white petals with yellow/peach light,
an ochre center, a slender green stem and visible chalk/print texture.
Exactly one bloom is shown, with no additional bud. Its image box is at most
300px high, placed at the lower right. The source illustration's sky and separate
grass blades are excluded from the moving flower layer.
Glass merges distant color into broad, soft areas. Diffusion increases continuously
from one fixed focus point near the flower center (0.35px to 16px blur), with no
visible lens boundary or rectangular samples. A 14-second breeze bends the upper
flower and stem behind this field while keeping the base fixed. Reduced motion
freezes movement, and hidden tabs pause.
Cursor interaction stays disabled. The existing Bloom backdrop and core layout
are unchanged. Its light backdrop in Dark appearance still has low exposed-title
contrast; that existing issue remains outside this flower-only revision.

Implementation: `components/experiments/atmosphere/createBloomField.ts`;
asset and generation provenance: `components/experiments/atmosphere/bloom-asset.md`.
This is a visual prototype awaiting review, not a permanent feature decision.

## Stepped/pixel motion accents (Experimental)

Discrete, "resolving" reveal treatments (e.g., for the Ask Jamie panel or its
input placeholder) as an alternative to continuous fades — unvalidated until
seen running.

## Ask Jamie frozen-glass material (Experimental)

**Added 2026-09-10, awaiting visual review.** A quiet, neutral counterpart to
the homepage's colorful weather glass: 56px blur with saturation pulled to
0.85, over a 66% `--color-surface-popover` fill. Where the homepage glass is
meant to be looked at (weather visibly moving behind it), this one is meant
to be looked *through* — a focused/reading surface (the Ask Jamie composer
and its suggestion pills) shouldn't compete with a moving background, so its
material stays still and desaturated instead of showing motion. Lives in
`components/experiments/frozenGlass/`, gated by
`ENABLE_FROZEN_GLASS_EXPERIMENT` in `app/ask/page.tsx`; disabling it restores
the original opaque composer with no other changes. The send button keeps its
solid fill (excluded via its `aria-label`) so its contrast doesn't depend on
whatever sits behind the glass.

## Accessibility & theming commitments (Settled)

- Apple HIG used as an interaction/accessibility reference only, never
  visual style.
- All colors are defined as semantic tokens (above) — no component assumes a
  light background.
- Dark reproduces the canonical dark palette. System theme selection is not yet implemented.

## Content review layer

Deferred. Will be introduced as a separate guideline when real case-study
content is added (narrative clarity, evidence vs. unsupported claims,
recruiter scanability, etc.) — not built now.
