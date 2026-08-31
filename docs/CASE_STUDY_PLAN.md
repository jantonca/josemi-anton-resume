# Case study plan — "Automotive Configurator Systems"

Decision: one substantial case study rather than multiple thin pages. The
page will explain the shared engineering domain (frontend architecture for
vehicle configurators) and then distinguish the two live products.

Status: **not written yet.** Every detailed claim needs the owner's explicit
confirmation first (questionnaire below). Nothing may be inferred from the
live sites — not contribution scope, technologies, architecture, outcomes,
team size, or metrics.

## Public proof already on the homepage

The "Selected Work" homepage section links to both live configurators with
neutral labels (product + where it is published). It intentionally makes no
claim beyond "configurators I have worked on recently":

- Lexus Crafted NX — `https://crafted.lexus.com.au/nx/?materialCode=2M00560B2LB433T5&ep=2M00560B2_ep`
- Toyota For You — HiLux — `https://sydneycitytoyota.dealer.toyota.com.au/toyota-for-you/home?vehicle=hilux&SC=37425`

No visual or functional claims are made about the live products. Deep-link
stability should be checked before publishing the case study, and the required
query parameters must be preserved verbatim in any link.

## Proposed structure (single page)

Route: `/work/automotive-configurator-systems/` — rendered through the
existing `Layout.astro`, no new dependencies, linked from the Selected Work
section and back to the homepage.

1. **Context** — the shared domain: frontend architecture for vehicle
   configurators delivered to web, kiosk and tablet; brand and market
   variants; the role (Senior Frontend Engineer, Rotor Studios — as already
   stated on the CV).
2. **The engineering domain** — recurring technical context and decisions,
   limited to details confirmed through the questionnaire. Only where personal
   confirmation exists do the two products get named inside it.
3. **Product 1 — Lexus Crafted NX** — confirmed contribution, technologies,
   decisions, challenges, outcomes.
4. **Product 2 — Toyota For You (HiLux)** — same structure.
5. **Closing** — what ties the two together; link to Contact.

Length target: 600–1000 words. A section with no confirmed content is
deleted, never padded.

## Required confirmation questionnaire (per product)

Before drafting, confirm each item. Anything unanswered stays out of the
page.

1. **Contribution** — exact role in each configurator (owned, built,
   maintained, contributed to which parts?).
2. **Technologies** — what I personally used (frameworks, rendering stack,
   state management, tooling) — only what is true and shareable.
3. **Architecture/decisions** — engineering decisions I owned, and why.
4. **Challenges solved** — concrete technical problems and how they were
   addressed.
5. **Scope** — supported devices, markets, models, integrations.
6. **Outcomes** — measurable results that may be disclosed publicly (none
   invented; qualitative statements are acceptable).
7. **NDA/confidentiality** — any restrictions on describing this work, and
   whether employer/client names may be used.
8. **Assets** — whether screenshots, imagery or logos may be reproduced.
   Until confirmed: no Lexus/Toyota imagery or logos are downloaded, stored,
   or republished anywhere in this repo.
9. **Possible engineering-domain prompts** — if relevant to the product, what
   configuration state had to be represented; whether vehicle-image assets
   required a dedicated pipeline; whether kiosk hardware imposed performance
   constraints or targets; and whether any components or patterns were shared
   across brands. These are prompts, not assumed attributes of either product.

Answers to 1–9 per product are sufficient to draft the page for review;
publishing then follows the indexing steps in `docs/SEO_CHECKLIST.md`.
