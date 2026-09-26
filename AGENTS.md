# AGENTS.md

## What this file is

This defines **how** work happens on this project — workflow, ambiguity
handling, approval boundaries, implementation practices, and verification.

It does not contain design specifics. What's currently decided lives in
[`DESIGN_DECISIONS.md`](./DESIGN_DECISIONS.md). Figma-specific reference
material (node mappings, page structure, interaction-state definitions) lives
in [`docs/figma-reference.md`](./docs/figma-reference.md). Read both before
making a design or implementation call — this file assumes their content and
should not duplicate it.

Two other documents split public from private:

- **`DESIGN_DECISIONS.md`** — public-safe. Visual system, layout,
  interaction, components, and public-facing storytelling principles. Safe
  to expose in the public GitHub repo.
- **`PORTFOLIO_STRATEGY.md`** — private, gitignored, never committed.
  Portfolio positioning, project selection, recruiter-facing narrative
  strategy, and project-specific critique. Read it before writing or
  restructuring case-study content, project copy, or homepage narrative.

For visual design, interaction, layout, components, and public-safe design
decisions, refer to `DESIGN_DECISIONS.md`. For portfolio strategy,
positioning, project selection, and recruiter-facing narrative, refer to
`PORTFOLIO_STRATEGY.md`. Never copy private strategy content from
`PORTFOLIO_STRATEGY.md` into public-facing files (`DESIGN_DECISIONS.md`,
site copy, commit messages, etc.) unless explicitly instructed.

Portfolio review agents (`senior-product-design-reviewer`,
`design-recruiter`, `contrarian-critic`, `english-copy-editor`) live in
`.claude/agents/`, backed by skills in `.claude/skills/`; run all four with
`/portfolio-review`, in batches if agent capacity is limited. The English
editor's canonical instructions live in `.cursor/agents/english-copy-editor.md`.
Each reads `PORTFOLIO_STRATEGY.md` read-only for positioning context and
never writes to it or quotes it verbatim.

## Tech stack

- Next.js (App Router), TypeScript, plain CSS with custom-property design
  tokens, no component library.
- The Ask Jamie backend/LLM/grounding architecture is undecided and out of
  scope until that feature is actually built. Do not scaffold API routes,
  choose a model provider, or design a grounding approach preemptively.

## Figma usage

- Figma is a starting reference, not a permanent source of truth once
  browser-based iteration begins (see "Design iteration workflow" below).
- `main_v2` is canonical; `main_v1` is a live design exploration only — never
  implement from it, never delete or archive it in Figma.
- Node mappings, page structure, and Style-page interaction-state definitions
  are in `docs/figma-reference.md`. Re-fetch from Figma directly when
  implementing a component rather than trusting a memorized value — the file
  may still change.

## Design iteration workflow

Once implementation exists, the running site is an active design environment,
not just a reproduction target. Support this loop for any design work,
whether it originates in Figma or not (e.g. a project case-study page that
doesn't exist in Figma at all):

**Figma and/or current implementation → inspect → discuss the actual design
problem → propose a small number of meaningfully different directions with
trade-offs → prototype the chosen direction in code → inspect in browser →
tune → keep / revise / discard.**

When asked to explore a design direction:
- Do not implement immediately unless asked to.
- Analyze the current design/content first and name the actual problem.
- Propose a few genuinely different directions, not variations on one idea,
  and explain their trade-offs.
- Prototype only the direction selected, and only when asked.

Do not treat the current Figma composition as permanently authoritative once
browser-based design iteration has begun on a given page or component.

## Ambiguity and recommendations

- If Figma or `DESIGN_DECISIONS.md` is silent or ambiguous on something, say
  so explicitly — don't silently invent a resolution.
- If you notice a design, layout, hierarchy, or accessibility problem, state
  the current value, the recommended change with a specific number/value, and
  the reason. Don't apply it silently — except for minor visual tuning
  (below), which doesn't require pre-approval.

## What requires approval vs. what doesn't

**Do without asking, judged live in the browser:**
Minor visual tuning within an already-approved direction — e.g. 1–4px
spacing adjustments, padding/margin/gap tuning, small sizing changes, optical
alignment, subtle opacity adjustments, minor motion timing/easing. After a
meaningful round of this kind of tuning, briefly summarize what changed and
why. Don't log every micro-adjustment in `DESIGN_DECISIONS.md` — the
implementation itself is the source of truth for these local values.

**Always ask first:**
Anything that materially affects information architecture, hierarchy,
interaction behavior, visual identity, component architecture, semantic
design-system tokens, or any decision recorded as settled in
`DESIGN_DECISIONS.md`. Also: promoting an experimental feature to permanent,
adding a new dependency, or touching Ask Jamie's actual AI/backend/data layer.

## Implementation practices

- Organize components by responsibility. Extract a component when reuse,
  complexity, or independent behavior justifies it — avoid both premature
  abstraction and oversized do-everything components.
- Tokens: colors always use semantic tokens; typography roles always use
  tokens; radii and repeated motion values (durations/easing) always use
  tokens; repeated/system-level spacing uses spacing tokens. A one-off
  optical/layout adjustment does not need an artificial token invented for it.
- Don't over-engineer the design-token system beyond what's actually reused.
- Desktop-first for now. Use CSS Grid/Flex, not absolute positioning, so
  responsive behavior can be added later without restructuring — but don't
  invent breakpoints or a mobile layout yet.
- Comment only where the *why* isn't obvious from the code itself.
- Commit only when explicitly asked.

## Experimental-feature isolation

Current experimental features are listed in `DESIGN_DECISIONS.md`. Whichever
they are, each one must:
- live in its own self-contained module with a single on/off toggle at the
  composition root
- introduce zero required props/dependencies into core layout or content
  components
- have zero effect on layout or content when disabled — removable by
  deleting its module and one wiring line, not by hunting through the
  codebase

Experimental interaction code must never leak into core layout/content
components.

## Accessibility checklist

(The theme-token architecture itself is defined in `DESIGN_DECISIONS.md` —
this is how you verify against it while building.)

Apple's Human Interface Guidelines are used as an interaction/accessibility
reference only, never a visual-style reference:
- keyboard accessible; visible, palette-consistent focus states
- adequate target sizes and spacing
- sufficient contrast; state is never conveyed by color alone
- `prefers-reduced-motion` respected — for the magnetic-dot experiment
  specifically, disable or substantially simplify cursor-attraction under
  reduced motion, and the site must remain fully usable with the effect off
  entirely
- sound is never the only feedback channel for a state change

## Verification

**Visual/UX work:** run the site and inspect the actual browser result. Do
not claim visual correctness from code alone. Experimental interactions
(magnetic dots, `:J` glyph, stepped motion) specifically require in-browser
judgment before being treated as anything other than experimental. Sound's
*scope* is settled (see `DESIGN_DECISIONS.md`), but its actual audio content
still needs to be heard and judged before being treated as final.

**Implementation work, before reporting anything complete:** typecheck,
lint, build, and run relevant tests if they exist. Resolve failures — don't
report completion around them.

## Content

No content-review harness yet. When real project case-study content is
added, a separate guideline layer (narrative clarity, evidence vs.
unsupported claims, recruiter scanability, etc.) will be introduced then —
don't build it preemptively.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
