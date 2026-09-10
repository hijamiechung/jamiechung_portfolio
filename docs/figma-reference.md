# Figma Reference

**Historical reference:** Claude Design in `reference/Claudedesign_v1/` now
supersedes Figma for visual and interaction implementation (2026-09-08).
See `DESIGN_DECISIONS.md` for the current port scope.

File: `https://www.figma.com/design/f7xKsqE2jG6slVB7BXSXV3/Portfolio_v2`
Pages: `main` (`0:1`), `Style` (`121:177`)

This document is descriptive, not authoritative once browser-based design
iteration begins on a given page or component — see `CLAUDE.md`'s "Design
iteration workflow." Re-fetch live Figma data when implementing; treat values
here as a snapshot from initial concept development, not guaranteed current.

## v1 vs v2

- `main_v2` (`813:469`) is the canonical implementation reference.
- `main_v1` (`1:2`) is a live design exploration only. Never implement from
  it, never treat it as a breakpoint, app state, or alternate density. Do not
  delete or archive it in Figma.
- A legacy off-canvas frame (`105:81`) and a stray floating text note on the
  `main` page are not spec — ignore them for implementation, and do not
  modify or archive them in Figma.

## Style page (`121:177`) — icon interaction-state reference

Defines default/hover pairs for sidebar and popover icons. Two hover
patterns:

- **Background-fill pattern** (`Tab`, `Hamburger`): plain icon by default,
  gains a `#7C7373` rounded-square background on hover.
- **Glyph-swap pattern** (`Project`, `Archive`, `Connect` [nav icon], `New`,
  `Component 1`/CV): default and hover are two different icon assets — hover
  shows a more detailed/resolved version (e.g. closed folder → open folder).
- `Chevron`'s `up`/`down` pair is a **functional expand/collapse state**, not
  a hover pair.
- `Connect1` (LinkedIn/Medium/Email) has default/hover pairs; LinkedIn's
  default is a crude "in" text glyph — implementation replaces this with the
  real SVG logomark (the asset Figma defines as the hover state) as the
  default, rather than keeping the text glyph.

## Component → Figma node mapping (v2)

| Component | v2 node(s) | Style-page source |
|---|---|---|
| AppShell | `813:469` | — |
| Sidebar | `851:939` | — |
| SidebarHeader | `851:940` | Logo `121:187`; Tab `607:51` |
| SidebarSection "Projects" | `851:945` (header `851:946`) | Project `538:18`; Chevron `851:928` |
| SidebarSection "Archive" | `851:959` | archive `538:19` |
| SidebarNavItem (children) | `851:951` / `851:953` / `851:955` / `851:957` | — |
| ProfileFooter | `851:964` | — |
| Avatar | `851:967`–`851:970` | — |
| Hamburger trigger | `866:1452` | hamburger `866:1451` |
| Popover / MenuItem | `866:1471` (+ `851:975`, `866:1462`, `851:979`, `866:1470`) | Connect1 `759:135`; Component1 `810:256` |
| SocialIcon (LinkedIn/Medium/Email) | inside popover children above | Connect1 `759:129`–`759:134` |
| ProjectsHeading | `813:525` | — |
| ProjectCard | `851:1026`, `851:1053`, `851:1066` | — |
| Badge | `851:1018` / `851:1060` / `851:1073` | — |

Note: `Connect` (nav icon) and `New chat` rows exist only in v1 (`767:184`,
`786:229`) — not present in v2's visible nav. Their function
(LinkedIn/Medium/Email/Resume) lives in the popover instead of a separate nav
row; don't rebuild them as standalone sidebar sections.

## Implementation notes

- The header "Tab" icon's function is now confirmed (see
  `DESIGN_DECISIONS.md` "Layout"): it collapses the sidebar to an icon-only
  rail. No longer an open question.
- The Logo mark (`121:187`) has been replaced in implementation with a plain
  "J" text glyph — a placeholder ahead of the full `:J` exploration
  (still experimental, not locked), not a literal translation of the Figma
  logo asset. The footer Avatar is unchanged (real photo).
- **Asset mapping caution:** two separate `get_design_context` fetches in
  this project (one on `main_v2`, one on the `Style` page) each declared a
  local constant named `imgGroup6`/`imgGroup7` pointing to *different*
  underlying assets. Copying a URL by variable name across fetches caused
  one real bug (the footer hamburger trigger briefly used the Style page's
  mail/envelope icon instead of the actual hamburger-lines icon). Always
  verify a downloaded asset's actual content (e.g. open the SVG) rather than
  trusting that a same-named constant means the same asset across calls.
- Typography and color values as originally observed in Figma have been
  superseded by the token system in `DESIGN_DECISIONS.md` — treat that file
  as authoritative for final values; this file is for structural/node
  mapping only.
