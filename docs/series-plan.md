# Game-AI series plan

Working outline for the `game-ai` series. Source material is the Grimoire repo's
`docs/ml/HISTORY.md` (eras 0-25+), which is append-only and authoritative for what
happened when. **Every factual claim in a post must be traceable to an era in that
file, and must belong to the era the post is narrating.** See "Data provenance" below.

Posts 1-2 are published. Post 3 is the merged flagship (previously planned as two
posts), outlined against the primary sources with inline provenance; a partial draft
of the pre-merge shape exists at `game-ai-beaten-by-an-if-statement.mdx` and gets
restructured, not discarded. Posts 4+ range from outlined to sketch.

**Outline before writing, from the archive, not from HISTORY's summary.** HISTORY is a
compact index; the lab notebooks under `archive/` are where the actual story is, and
they routinely contradict the shape you would guess. Outlining post 3 from HISTORY put
the 18.5% figure in the wrong post and missed the Elo ladder entirely, which is the
best material in the era.

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

### 3. Beaten by an If-Statement — NEXT (the merged flagship)
**Era 1 (2026-06-28 → 06-29).** One post, mystery to resolution. This absorbs what
was previously planned as two posts; the split diluted the wow into a setup post and
a payoff post, and two independent planning passes (the recovered old draft and this
one) converged on the single-post shape.

> Verified against `archive/training-performance.md:875-895` (yardstick),
> `:992-1039` (clone → bisection → proxy → pointer), commit `e24fd7c6` (the
> heuristic), `archive/strength-program-spec.md:157-180` (640/640 validation, oracle
> omitted as too slow, Bradley-Terry). The 18.5% figure is the CLONE, not the
> from-scratch net.

**Shape (novelty density rises monotonically):**
1. *The yardstick, compressed* (~800 words): heuristic built and validated 640/640,
   Elo Concept block + demo (KEEP whole — pedagogy is deliberate), the ladder:
   heuristic **1081**, search_m1 648, policy_v2 591, random 0; **100%** vs the bare
   net (same score as vs random); curve check 433 pts → 92.4% predicted vs 92%
   observed. Solver/oracle failures compressed to a few sentences of color.
2. *The obvious fixes, one paragraph each*: bigger net (post 2 callback), longer
   training, search (helps ~10 pts, stalls far below the heuristic at any budget —
   the FULL audit war story moves to post 5).
3. *The clone paradox*: 99.3% action agreement, 90.2% good-type — and 18.5%
   [16.9, 20.3] over 1000 games. A near-perfect mimic loses four in five.
4. *Rule-out montage*: entity obs + transformer 73.2% vs flat 73.0% (the reader's
   own hypothesis, killed), capacity plateau ~80%, DAgger flat, not covariate
   shift, soft labels made it WORSE (80% → 68.6%).
5. *The bisection*: clone's action + heuristic's targeting = **51.2%**. Entire gap
   localized to substep targeting.
6. *The reveal + moving-slots demo*: per-instance codec — "take the diamond" never
   had a stable address.
7. *The conviction*: crude per-type proxy on ONE decision → **46%** from 18.5%.
8. *The fix, properly*: **pointer head** Concept block + candidate-scoring demo —
   pays Part 1's attention plant ("a hand of cards is a set of things with
   relationships"). Official parity **48.5/49.5%** on the 2000-game ladder, zero
   algorithm changes.
9. *Ending: parity isn't winning* (the recovered draft's framing). Level with a few
   hundred if-statements is the floor, not a victory — and there is nothing left to
   imitate. Hands post 5 its question.

**Demos:** EloDemo (built), moving-slots codec demo (to build), candidate-scoring
demo (to build). **Figures:** the Elo ladder (built), possibly an 18.5 → 46 → 48.5
progression. ~4,500 words. This is the HN submission.

### 4. What the Network Sees
**Eras 1-2, the perception thread.** The pointer head fixed how the net SPEAKS; this
post is about what it SEES, and the running discovery that information, not capacity,
was always the ceiling.

- The audit finding that is almost comic: the net was **blind to public opponent
  state** — hand size, herd, banked tokens masked to −1 despite being open
  information. It played a hidden-information game with more hidden from it than the
  rules hide (`archive/training-performance.md:1010`, W0 audit).
- Encoder v2 (per-container composition) beats v1 **60.3%** — pure information gain
  (trace the 60.3% to its primary source before use; currently only in HISTORY).
- Perfect recall (v3): tracking cards that were publicly seen entering hidden zones —
  the opponent's hand is partially KNOWABLE, not just countable.
- Value-sight (v4) and the champion lineage's encoder half.
- REINFORCE on the take head hovers at parity (best 50.5%, CI includes 50) — the
  heuristic's take rule is near-optimal, so there is *nothing left to imitate*
  (`training-performance.md:1041`). Ends: seeing everything, speaking properly,
  still level. Climbing needs something other than imitation.

### 5. Thinking Before Moving
**Era 2, the search post.** This is where the Part 1 promise lands: "lookahead in the
minimax tradition and its modern randomized descendants get their own tinted block the
moment we meet one properly."

- **Opens with the audit war story** (moved from post 3, stronger here): the first
  time search wrapped the net it made a PERFECT prior worse (action agreement 100% →
  83%); five audit lenses found zero bugs; the value was the culprit; the
  score-margin value fixed it on the spot (100% → 100%) and produced the first
  seed-improvement (20% → 29%); then 4× sims bought nothing. Search saturates below
  the heuristic; the AZ flywheel needs search > policy and cannot get it here.
- **Concept blocks owed:** PUCT/MCTS (explore vs exploit, visit counts, prior-guided
  — MinimaxDemo's sequel), the AlphaZero ratchet (search as a policy-improvement
  operator, distilled back), determinization (hidden info → sample worlds).
- Search at inference: +7-10 pts, the one measured lever. The parity basin: PPO
  self-play converges to a fixed point (G/H/I in the retrospective); only a distinct
  weaker anchor ever produced an edge (champion_v4, 62.5% vs v2).
- The champion lineage v3 → v6, exploitability gate at every promotion.
- **Elo → TrueSkill.** Era 1's ladder was dependency-free Bradley-Terry
  (`strength-program-spec.md:178-180`); TrueSkill arrives with `tools/round_robin.py`
  and carries a σ, so promotion rows read "TrueSkill tie, 22.03 vs 21.54 inside σ" —
  a rating system refusing to call a winner. Same instrument-honesty thread post 3
  opens and era 25 closes. Gets its Concept block here.
- Methodology hardened in blood: seed-noise floors, read-the-tape, single-sourced
  reward currency, self-describing checkpoints. Jaipur declared saturated.

### 6. One Pipeline, Every Game
**Era 4.** The generalization sweep: which of 12 games actually learn. 5/6 learn past
random *after* the reward/eval orientation fix, and the fix is the story — three broken
score shapes (winner-only, lower-is-better, 4-player) all traced to assuming Jaipur's
shape. Checkers and Coup blocked. `ml2-first-curve.png` belongs here.

### 7. A Thousand Times Faster (and where that wasn't enough)
**The performance post** — reframed (user, 2026-08-05) from "the JAX post" to "where
speed actually comes from," so it can carry the project's recurring lesson: the wall
was never compute.

- The walls that were structure, not hardware: `SubprocVecEnv` lockstep (era 1); CFR
  re-walking an unchanging tree (era 10 — export the EFG once, **~400×**, a ten-hour
  solve becomes 90 s); per-ply Python dispatch (**4.8×** from `lax.fori_loop`
  fusion); the exact solver's **7.7×**; profile-before-you-wait as the discipline
  (the silent verbose flag that nearly cost a wrong scientific call).
- The recent **non-JAX encoder optimizations** (user, 2026-08: "much faster without
  JAX") — pull the numbers from the repo when drafting; they are the thesis in
  miniature.
- THEN the compiler as culmination: `.grim` → JAX, ~1000× raw, 488 games/s fused, a
  champion beaten for ~$1; Jaipur on the generic tier at **4,331×** batched with the
  25,505-slot head certified exact (era 26).
- The honest coda: 4,331× batched bought **2.42×** on a sequential solver — batch
  throughput and sequential latency are different currencies (era 26's audit-substrate
  verdict). Infra-vs-capability lesson; guards as floors.

### 8-12. Sketches
- **The Games That Refused** — Eras 5-6, the equilibrium pivot and CFR. PG-family
  structurally capped on bluff-core (Leduc nash_conv 0.49 vs tabular 0.0137); Kuhn's
  8.6× that did not replicate; `leduc.grim` == pyspiel digit-for-digit. Owes Concept
  blocks: information sets, exploitability.
- **Three at the Table** — Eras 8-10, n-player as the same formula (validated against
  pyspiel's kuhn3), the position-keyed-rows correction.
- **A Text File Goes In, an Expert Comes Out** — Era 11, equilibrium balance reports:
  seat values, dead-rule flags, mixing as the bluff signal, gates to 2e-16. Post 1's
  promise, kept.
- **Ship Week** — Eras 12-18. Skull (the tool's first catch was OUR rules bug), Love
  Letter, For Sale.
- **The Blunder That Wasn't** — Eras 19-25. Never let a model grade its own
  counterfactual. Strongest single story in the archive.

### 13-15. The live log (none of this has happened yet)
- **Race for the Galaxy** — the authoring arc (R1: 95 cards, one new primitive), then
  the Keldon yardstick (see Standing re-evaluations below).
- **Press the Button** — autonomy; every champion so far was hand-shepherded, and the
  product is the unbuilt part.
- **Nobody Writes YAML** — the designer surface; post 1's bridge-from-the-designer's-
  side claim made true.

---

## Standing re-evaluations

Later eras complicate earlier posts' conclusions. Field-notes tense means the earlier
posts are never *corrected* — they claimed only what was measured — but these beats
must land when their post arrives.

**Keldon's bot vs the pointer head** (for the RFTG post). Keldon's expert-level RFTG
AI is a ONE-hidden-layer ~50-unit MLP over ~600-1,800 *hand-crafted binary features*
(`docs/ml/reference-keldon-rftg.md`). No pointer head, no attention, tiny capacity —
and expert play. This does not refute era 1; it is the same lesson from the opposite
direction: **capacity was never the lever, representation was.** Keldon supplied the
representation by hand for one game; the pointer head is the attempt to DERIVE it for
any game. State this outright when the post arrives — it is the project's thesis in
one comparison.

**The yardstick teaches** (same post). The outside reference does not just measure —
it gets harvested: thermometer encoding is already a roadmap item
(`ai-roadmap.md:1069`, "the one Keldon feature that IS an algorithm": counts as
`[1,1,1,-1,…]` so "at least k" is one weight). Post 3's heuristic taught `_SET_NUDGE`;
Keldon teaches encodings. The instrument keeps turning into curriculum. If thermometer
encoding ships across the board, that is a measured re-evaluation of the encoder
lineage and belongs in whichever post is current when it lands.

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

Two threads post 3 must introduce cold, because Part 2 cut them for length. Neither is
a loss; both were judged off the critical path of Part 2's story.

**Fungible collapse.** Part 2 once carried an identical-cards paragraph (selling two
cloth from a hand of four enumerated the same choice six ways; collapsing them bought a
60× speedup, commit `7a3e...`, 2026-03-10). It was cut in review. Post 3 introduces
fungible-collapse from scratch rather than as a callback. The engine-level precedent is
still true and still quotable if post 3 wants it.

**Per-instance action indexing.** The **take-a-good** question is indexed per card
*instance* in the market, which is the precise defect post 3 reveals. Part 2's
EncodeDemo walks the *sell* path, where the questions are naturally per-type, so it
steps past the flaw without lying about it. Post 3 owns the full reveal.
