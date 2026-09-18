---
description: Run a full multi-agent portfolio review — Senior Product Design Reviewer, Design Recruiter, and Contrarian Critic in parallel, then a synthesis.
---

Run the three portfolio review agents independently against the current
state of the portfolio, then synthesize their findings.

## Steps

1. Launch these three agents in parallel, in a single message with three
   Agent tool calls:
   - `senior-product-design-reviewer`
   - `design-recruiter`
   - `contrarian-critic`

   Give each the same scope: the homepage (`app/page.tsx`), project data
   (`lib/projects.ts`), and project detail pages
   (`app/projects/[slug]/page.tsx`), unless the user's invocation of this
   command names a narrower scope (e.g. one specific project) — in that
   case, pass that scope to all three agents instead so they're reviewing
   the same material.

2. Wait for all three to finish. Do not synthesize from only one or two.

3. Synthesize. The synthesis is not an average of the three opinions. It
   must identify:
   - where all three agree
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
