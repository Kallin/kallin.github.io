# Game-AI series plan

Working outline for the `game-ai` series. Source material is the Grimoire repo's
`docs/ml/HISTORY.md` (eras 0-25+), which is append-only and authoritative for what
happened when. **Every factual claim in a post must be traceable to an era in that
file, and must belong to the era the post is narrating.** See "Data provenance" below.

Posts 1-2 are settled. Posts 3-5 are firm in shape. Posts 6+ are sketches; expect them
to move as later eras get written up.

---

## Standing conventions

These were established during Parts 1-2 review and are not up for renegotiation
per-post.

**Voice: field notes, written from inside the moment.** The narrator does not know
what happens next. Banned constructions: "it turned out to be", "I would later
discover", "in hindsight", "much later". Speculation about the future is fine and
encouraged ("I have a nagging feeling this is bigger than a performance fix"); reports
*from* the future are not.

**No presumed audience.** Nobody has seen this project, asked questions about it, or
formed opinions on it. Banned: "the two questions people usually ask", "as you'd
expect", any appeal to received wisdom the author hasn't personally earned ("something
I'd been told a hundred times"). The reader is meeting all of it cold.

**No cadence promises.** Never state or imply a publishing schedule. No "see you next
week", no "next post picks up here". End on the work, not on logistics. Structural
navigation is `SeriesNav`'s job.

**No em-dashes, no curly quotes in source.** Commas, colons, semicolons, and periods
carry the load. Check with a grep before shipping.

**Every new concept gets a tinted `Concept` block with a manually-stepped demo.**
No gesturing at an acronym and moving on. Demos must be pixel-stable: the figure
height and the control-button Y position must not move between steps (reserve caption
space with `min-height`, hide with `visibility/opacity` not `display:none`). Verify
with a Playwright loop measuring document-relative `getBoundingClientRect` at every
step, and read the screenshots.

**Demos must not contradict each other.** PPODemo originally showed a policy as
context-free action frequencies while EncodeDemo correctly showed observation-in /
per-option-scores-out. Two demos teaching incompatible mental models is worse than one
demo missing.

**Reference well-known games** when reaching for an analogy. The reader knows chess,
poker, and Monopoly; they do not know Jaipur until Part 2 teaches it.

**Figures in the house matplotlib style.** Helvetica; INK `#1f2d3d`, MUTED `#6b7684`,
BLUE `#2e5f8b`, BLUE_FILL `#eaf1f7`, RED `#b4341f`, GRAY `#9aa5b1`, GRAY_FILL
`#f4f5f7`. Card colors: diamond `#7aa7d4`, gold `#d9a441`, silver `#9aa5b1`, cloth
`#b06fa0`, spice `#c96f4a`, leather `#9b8360`, camel `#c2a171`. Blog content column is
~720px, so size type for legibility after downscale.

**Caveat weak instruments explicitly.** When a number comes from a bot that isn't
strong, say so and name the alternative explanation. The seat-advantage story in Part 2
is the template: state the observation, name the confound ("might be a fact about
Jaipur, or a fact about *this agent*"), then land on the conclusion the evidence
actually supports.

---

## Data provenance

**Burned once already.** Part 2 shipped a draft containing a Crazy Eights learning
curve (5% → 97%) presented as the first experiment's result. The number is real, but
it comes from `training-techniques.md` § 3.6 "Generalization sweep", sourced to
`archive/generalization-2026-06-30.md`, which `HISTORY.md` files under **Era 4** and
explicitly qualifies as "after the reward/eval orientation fix". Before that fix,
Crazy Eights trained to *lose* (its scoring is lower-is-better and the reward
derivation assumed Jaipur's shape). It also had the no-op-loop termination bug at the
time. So it was a later trainer's post-bugfix result on a then-broken game, four eras
early, with an interpolated curve on top.

Before using any number: grep `HISTORY.md` and `experiments.md` for it, confirm which
era it belongs to, and confirm the post narrating that era is the one using it.
`ml2-first-curve.png` is still in `public/images/posts/` unused; it is the *right*
figure for post 6.

---

## The posts

### 1. One Machine, Any Game — LIVE
`game-ai-one-machine-any-game.mdx` · published 2026-07-15

Seventy-five years of game-playing AI as setup for the bet. Search era → learning turn
→ hidden information → convergence (Student of Games). Then: why isn't this solved?
Every system plays a handful of hand-integrated games. GDL / Ludii / OpenSpiel built
the bridge from the algorithms' side. The bet is to build it from the designer's side.
Demos: MinimaxDemo, NeuralNetDemo, RegretDemo, RLDemo.

### 2. From Random to Reasonable — IN REVIEW
`game-ai-from-random-to-reasonable.mdx` · **Era 0**

The engine, the format, Jaipur, and the first learning agent. Immutability + legal-move
enumeration as the two day-one bets. `.grim` anatomy. Observations and action masks.
Gymnasium/PettingZoo/SB3 MaskablePPO off the shelf. It beats random; the loop closes.
War stories: the do-nothing loop, the seat advantage, the bigger brain that changed
nothing. Ends on: every number is self-referential, so build a real yardstick.
Demos: GrimDemo, EncodeDemo, CreditDemo, PPODemo. Figures: jaipur-table, pipeline, noop-loop,
seat-advantage.

### 3. Beaten by an If-Statement — NEXT
**Era 1, act one.** Inherits Part 2's cliffhanger directly.

Build the yardstick and get humiliated by it. A hand-written heuristic Jaipur bot is
the fixed external reference; the net that beats random essentially every game **caps
at 18.5% against it**. Then rule out the obvious explanations, one at a time: bigger
nets (null), longer training (works but saturates per-game), throughput (the wall was
`SubprocVecEnv` lockstep, *not* cores or GPU — a good engineering beat). Ends on: it is
not the learner and it is not the compute, so it must be how I am talking to it.

The positive content is methodology: what makes a yardstick honest, and why "beats its
own previous version" never could be. This theme runs the whole series and peaks at
era 25.

### 4. The Net Couldn't Name Its Own Moves
**Era 1, act two.** The payoff.

The gap was the **action codec**, not the learner. One policy slot per card *instance*,
ordered by id, meant "take the diamond" had no stable slot to learn. Fungible-collapse
(per-type actions) + the **pointer head** (score each candidate from its own features)
reached **parity at 48.5%** with zero algorithm changes. Encoder v2 beat v1 60.3%:
information, not capacity, was the ceiling. SB3 deleted for a hand-rolled PPO. The
winner-orientation reward bug found and fixed (some games had been optimizing garbage).

Pays off both of Part 2's plants (see below).

### 5. Thinking Before Moving
**Era 2.** Search at inference: +7-10 points on the same net, the first real edge. The
AlphaZero ratchet (distill search back into the net, iterate). The champion lineage
v3 → v6 with an exploitability gate at every promotion. Methodology hardening paid for
in blood: seed-noise floors, read-the-tape-before-retraining, single-sourced reward
currency, self-describing checkpoints. Jaipur declared saturated.

### 6. One Pipeline, Every Game
**Era 4.** The generalization sweep: which of 12 games actually learn. 5/6 learn past
random *after* the reward/eval orientation fix, and the fix is the story — three broken
score shapes (winner-only, lower-is-better, 4-player) all traced to assuming Jaipur's
shape. Checkers and Coup blocked. `ml2-first-curve.png` belongs here.

### 7. Games on a GPU — the `.grim` → JAX compiler
**Era 3** chronologically; may run after 6 for narrative reasons.

The one the author most wants to write. A `.grim` file compiles to a JAX simulator:
raw sim ~1000× the interpreted engine, fused searched self-play 488 games/s at
sims=16 (514×), and a from-zero tensor-trained net beat the engine-substrate champion
**for about a dollar**. Throughput and strength are coupled through the sims budget.
Also carries the retrospective lesson: name whether an arc is answering an
*infrastructure* question or a *capability* question, and keep validation guards as
floors rather than frontiers.

Later JAX arcs (PPO-on-JAX for the low-hidden-info deck class, 674× CPU) may fold in
here or get their own post.

### 8-10. Sketches only
- **The games that refused** — Eras 5-6, the equilibrium pivot and CFR. Kuhn's 8.6×
  win that did not replicate on Leduc. Why hidden information breaks the AlphaZero
  recipe.
- **A text file goes in, an expert comes out** — Eras 8-11, n-player tabular, balance
  reports, the original motivation finally consuming the agents.
- **The blunder that wasn't** — Eras 19-25. Five eras chasing a Jaipur sell "defect"
  that turned out to be correct play, and the rule that cost: never let a model grade
  its own counterfactual. Probably the strongest single story in the archive.

---

## Unspent plants

Seeds deliberately planted in published posts, and where they get paid off. Do not
leave these dangling.

| Planted in | The seed | Pays off in |
|---|---|---|
| Part 2, count-only encoder | The learner plays Jaipur without knowing which cards are in the market; "a question I'm deliberately not thinking too hard about yet" | **Post 4** — encoder v2, information not capacity |
| Part 2, seat advantage | 73% first-player in a mirror, caveated as possibly an artifact of a weak agent | Whenever a strong agent re-measures it |
| Part 2, bigger brain | Null result, measured with instruments from inside the same small world | **Post 3** — the yardstick reveals why that comparison was blind |

## Deliberately NOT planted

Two threads post 4 must introduce cold, because Part 2 cut them for length. Neither is
a loss; both were judged off the critical path of Part 2's story.

**Fungible collapse.** Part 2 once carried an identical-cards paragraph (selling two
cloth from a hand of four enumerated the same choice six ways; collapsing them bought a
60× speedup, commit `7a3e...`, 2026-03-10). It was cut in review. Post 4 introduces
fungible-collapse from scratch rather than as a callback. The engine-level precedent is
still true and still quotable if post 4 wants it.

**Per-instance action indexing.** The **take-a-good** question is indexed per card
*instance* in the market, which is the precise defect post 4 is about. Part 2's
EncodeDemo walks the *sell* path, where the questions are naturally per-type, so it
steps past the flaw without lying about it. Post 4 owns the full reveal.
