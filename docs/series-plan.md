# Game-AI series plan

Working outline for the `game-ai` series. Source material is the Grimoire repo's
`docs/ml/HISTORY.md` (eras 0-25+), which is append-only and authoritative for what
happened when. **Every factual claim in a post must be traceable to an era in that
file, and must belong to the era the post is narrating.** See "Data provenance" below.

Posts 1-2 are published. Post 3 and 4 are outlined against the primary sources and
carry inline provenance. Posts 5+ are sketches; expect them to move as later eras get
written up.

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

### 3. Beaten by an If-Statement — NEXT
**Era 1, act one (2026-06-28).** Inherits Part 2's cliffhanger directly.

> Outline verified against `archive/training-performance.md:875-895` (the yardstick
> entry), `:992-1006` (the AZ arc), and commit `e24fd7c6` (the heuristic itself).
> Corrects an earlier sketch that put the 18.5% figure here; that number is a
> *cloned* net and belongs to post 4.

**The build.** Part 2 promised a yardstick, so this post builds one, and it is more
than a bot: `grimoire/ai/yardstick/` ships a hand-authored Jaipur heuristic (the "mid
anchor"), an agent zoo, a Bradley-Terry **Elo ladder**, and an alpha-beta endgame
solver meant to supply exact ground truth. The solver is a good beat on its own: it
verifies on tic-tac-toe and is **intractable on Jaipur**, because `exchange` is
combinatorially branchy, so every deck≤1 position blows the budget. No brute-force
truth for this game. The heuristic (291 lines, commit `e24fd7c6`) is deliberately
*not* optimal by its own docstring: sell sets for bonus tokens, grab high-value goods,
keep camels for exchanges, dump leather, with named thresholds so it reads as intent
(`_SET_NUDGE = 0.6`, "prefer goods we're already collecting").

**The humiliation.** Full ladder, 50 games/pair, seat-balanced: heuristic Elo **1081**,
search_m1 **648**, policy_v2 **591**, random **0**. Pairwise the heuristic beats
policy_v2 **100% of games** and search_m1 92%. So the whole trained lineage sits ~490
Elo below a few hundred lines of hand-written priorities, and every bit of Part 2's
"progress" was real motion happening entirely below the floor of competent play. The
Elo framing is what makes it land: 591 is genuinely far above random, and still
nowhere.

**The obvious fix, failing.** Then the AlphaZero move: wrap the net in search and let
it teach itself. Search *is* a positive operator (search@128 27% vs greedy 17%) but it
does not scale (search@512 ≈ 21%, inside noise) and the flywheel will not turn, because
AZ needs search > policy and here search ≈ policy. Ends on: it is not the algorithm and
it is not the compute. Something more basic is wrong.

**Concept blocks needed:** Elo (a rating that is relative but anchored across a whole
population, which is exactly what "beats its own previous version" never gave us).
Possibly a second on why exact search dies on Jaipur.

**Figure candidates:** the Elo ladder as a horizontal scale with random / policy_v2 /
search_m1 / heuristic marked, which tells the whole story in one image.

### 4. The Net Couldn't Name Its Own Moves
**Era 1, act two (2026-06-28 → 06-29).** The payoff, and a genuine detective story.

> Verified against `archive/training-performance.md:992-1039`.

**The clone.** If the net cannot beat the heuristic by learning, clone it: behavioural
cloning on heuristic games. The clone is a *good* imitator (action 99.3%, good-type
90.2%, count and stop near perfect) and still loses, laddering at **18.5%**, CI
[16.9, 20.3] over 1000 seat-balanced games. A near-perfect mimic that reliably loses to
its teacher is a great puzzle.

**The localizing experiment** (the centrepiece): hybrid agent, clone's top-level action
choice + heuristic's substep targeting = **51.2%**, versus clone-only 18.5%. One test
proves the strategic brain already matches and the entire gap lives in substep
targeting, specifically take-good.

**The rule-outs**, each its own dead end: capacity (bigger nets plateau ~80% take
accuracy), data (DAgger flat across 3 rounds, 545k decisions), representation (entity
obs + transformer: 73.2% vs the flat clone's 73.0%, identical), distribution (not
covariate shift), soft labels (value-distillation made it *worse*, 80% → 68.6%).

**The cause.** The bug is the **per-instance action codec**: one policy slot per card
*instance*, ordered by id, so "take the diamond" had no stable slot to learn. Fungible
collapse (per-*type* with a count feature) plus the **pointer head** (score each
candidate from its own features) reaches **parity, 48.5%**, CI [44.5, 52.6], with zero
algorithm changes. Representation was the lever the whole time.

Also here if it fits: encoder v2 beat v1 60.3% (information, not capacity, was the
ceiling), and sb3 gets deleted for a hand-rolled PPO. The winner-orientation reward bug
may be better held for post 6, where it is the headline.

Pays off Part 2's count-only-encoder plant. Introduces fungible collapse cold (see
"Deliberately NOT planted").

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
