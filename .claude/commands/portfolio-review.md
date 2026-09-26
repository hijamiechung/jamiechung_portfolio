---
description: Review portfolio design, hiring signal, evidence, and English copy with four specialist agents, then synthesize.
---

Run the four portfolio review agents independently against the current
state of the portfolio, then synthesize their findings.

## Steps

1. Launch these agents independently, in parallel when capacity permits.
   If concurrency is limited, run the remaining reviewer when a slot opens:
   - `senior-product-design-reviewer`
   - `design-recruiter`
   - `contrarian-critic`
   - `english-copy-editor`

   Give each the same scope: the homepage (`app/page.tsx`), project data
   (`lib/projects.ts`), and project detail pages
   (`app/projects/[slug]/page.tsx`), unless the user's invocation of this
   command names a narrower scope (e.g. one specific project) — in that
   case, pass that scope to all four agents instead so they're reviewing
   the same material.

   For Figma requests, provide the same fresh frame extraction to all reviewers,
   distinguishing body copy from revision notes. The English editor reviews
   English passages only; if none exist, report that this pass is not applicable.

2. Wait for all four to finish. Do not present a partial review as a full one.

3. Synthesize. The synthesis is not an average of the four opinions. It
   must identify:
   - where the reviewers agree
   - where they disagree, and preserve that disagreement rather than
     smoothing it over — differing verdicts from different vantage points
     are useful signal, not noise to resolve
   - which criticism matters most, and why
   - which issue most affects hiring signal specifically
   - which issue most affects design credibility specifically
   - which issue can safely be ignored (and why it's safe to ignore)
   - the top 3 changes with the highest leverage, ranked

4. Do not modify any portfolio content as part of this command. This is a
   reporting workflow — present the synthesis and stop. If the user then
   asks you to act on specific findings, treat that as a separate,
   explicit request.
