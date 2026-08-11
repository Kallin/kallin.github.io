# CLAUDE.md — kallin.github.io

Personal Astro blog. **Pushing to `master` deploys the live site** (GitHub Actions →
Pages), so a push is a publish: get explicit approval before pushing anything
user-visible.

## Dev

Node via mise: `eval "$(mise activate zsh)"` first, then `mise exec -- npm run dev`
(serves at `http://localhost:4321`) or `mise exec -- npm run build`. Posts are MDX
content collections under `src/content/blog/`; `draft: true` renders in dev only.

## The game-ai series

The series plan, post outlines, era mapping, and full conventions live in
[`docs/series-plan.md`](docs/series-plan.md) — read it before touching any
`game-ai-*` post. The non-negotiables, distilled:

- **Field-notes voice.** Each post narrates from inside its moment, and the narrator
  does not know what happens next. This bans two shapes, not one:
  - *Backward leaks* — knowledge from later eras. "It turned out", "I would later
    learn", "in hindsight".
  - *Forward teases* — promises about what future work or future posts will show.
    "This becomes important later", "the main character of the next post", "you'll
    see why in part 5". Tempting because they feel like good serial writing; they
    are the narrator claiming to have read ahead.
  - Legitimate and encouraged: in-the-moment **speculation** ("I suspect this is
    bigger than a performance fix", "seems like a useful thing to have lying
    around") and **in-post signposting** whose payoff lands in the same piece
    ("remember that lean"). The test is whether the narrator could honestly say it
    on the day.
- Also banned: presumed audience ("people usually ask"), cadence promises ("see you
  next week").
- **No em-dashes, no curly quotes in post/demo source.** Grep before shipping.
- **Every claim traces to the Grimoire repo's records**
  (`../grimoire/docs/ml/HISTORY.md` is the index; the lab notebooks under
  `docs/ml/archive/` are the truth). A number must belong to the era the post
  narrates — a real figure from the wrong era already burned us once.
- **Concept blocks + stepped demos** for every new technical term. Demos must be
  pixel-stable across steps (verify with a Playwright loop: figure height and
  Next-button Y at every step, at two viewport widths), and small text verified at
  1:1 scale, not inside a downscaled capture.
- **Diagrams are DOM components; matplotlib only for data graphics** (bars, curves,
  scales). Box-and-arrow PNGs collide their labels; the browser doesn't.
- **Ship checklist:** pubDate = actual publish date, `socialImage` og card in
  `src/assets/`, `draft: false`, build green, selective `git add` (see below), push
  only on explicit go-ahead, then Search Console → Request Indexing for the new URL.

## Do not commit

`src/content/blog/game-ai-is-it-actually-good.mdx` and
`game-ai-one-pipeline-every-game.mdx` are stale drafts from a superseded plan (kept
locally as salvage material), and `public/images/posts/ml1-*.png` belong to them.
`ml2-first-curve.png` is unused by design — it is reserved for the post that narrates
its actual era (see the series plan's data-provenance section).
