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
what happens next. Two banned shapes, and the second one keeps slipping through:

- *Backward leaks*: "it turned out to be", "I would later discover", "in hindsight",
  "much later".
- *Forward teases*: "this becomes important later", "the main character of the next
  post", "it will matter more than it does here". These read as good serial craft,
  which is exactly why they survive review, but they are the narrator claiming to
  have read ahead. Caught twice on 2026-08-10, in a PPODemo caption and post 3's
  anatomy paragraph, by the user rather than by the sweep.

Fine and encouraged: **speculation** ("I have a nagging feeling this is bigger than a
performance fix", "a network with an opinion about who is winning seems like a useful
thing to have lying around") and **in-post signposting** whose payoff lands in the
same piece ("remember that lean", "because that matters later" where later is four
paragraphs down). The test: could the narrator honestly say this on the day?

Sweep before shipping, over posts AND demo captions:

```
will matter | becomes? the main character | in the next post | the next one
later in this series | will turn out | will become | you will see | we will see
turned out | I would later | in hindsight | eventually | people usually | see you next
```

Expect in-post signposting to appear in the results; read each hit rather than
deleting on sight.

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

**Verify legibility at 1:1, not inside a downscaled capture** *(learned 2026-08-05:
the Elo curve shipped review rounds with ~8px axis text because it was only ever
judged inside full-demo screenshots)*. For any region with small text (SVG charts
especially), element-screenshot JUST that region at natural scale and read it. SVG
text must land ≥12 physical px after the viewBox-to-rendered-width scaling — compute
it, don't eyeball it: rendered px = css-font-size × (container width / viewBox width).

**Demos must not contradict each other.** PPODemo originally showed a policy as
context-free action frequencies while EncodeDemo correctly showed observation-in /
per-option-scores-out. Two demos teaching incompatible mental models is worse than one
demo missing.

**Reference well-known games** when reaching for an analogy. The reader knows chess,
poker, and Monopoly; they do not know Jaipur until Part 2 teaches it.

**Diagrams are DOM components; matplotlib is for data graphics only** *(user
direction, 2026-08-05, after the stitched-networks PNG shipped label/line collisions
twice)*. Anything made of boxes, arrows, routes, or flows becomes an Astro component
(stepped where a sequence helps, static DOM otherwise): the browser lays out the text,
so nothing collides and everything stays crisp under the ZoomImage lightbox.
Matplotlib stills remain for genuinely data-shaped figures — bar charts, curves,
scales (the Elo ladder, the lever-isolation bars). Review figures at BOTH sizes: 720px
for legibility, full resolution for geometry, because zoom is a first-class viewing
mode on this blog.

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

### 2. From Random to Reasonable — LIVE
`game-ai-from-random-to-reasonable.mdx` · published 2026-07-28 · **Era 0**
(amended 2026-08-14: PPODemo gained a value-head step, paying the debt below.)

The engine, the format, Jaipur, and the first learning agent. Immutability + legal-move
enumeration as the two day-one bets. `.grim` anatomy. Observations and action masks.
Gymnasium/PettingZoo/SB3 MaskablePPO off the shelf. It beats random; the loop closes.
War stories: the do-nothing loop, the seat advantage, the bigger brain that changed
nothing. Ends on: every number is self-referential, so build a real yardstick.
Demos: GrimDemo, EncodeDemo, CreditDemo, PPODemo. Figures: jaipur-table, pipeline, noop-loop,
seat-advantage.

### 3. Beaten by an If-Statement — LIVE (the merged flagship)
`game-ai-beaten-by-an-if-statement.mdx` · published 2026-08-14 · ~2,600 words
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

**As shipped:** the draft came in at ~2,600 words, not 4,500 — the mis-step montage
compressed into a levers figure and the search-audit war story moved wholesale to post
5. Demos: EloDemo, CodecDemo, StitchDemo, PointerZoom, plus two static blueprints
(OldNetBlueprint, NetBlueprint). Figures: ml3-elo-ladder, ml3-levers.

**The visual grammar this post established** (reuse it): every architecture claim gets
a *blueprint* (layers, weight shapes, branch points), and every mechanism gets a *zoom*
into one band of that blueprint, stepped. Old and new architectures are drawn in the
SAME grammar so the diff reads as one column. Rewriting a caption is cheaper than
adding prose, but when a caption starts doing three jobs, split the step instead — the
matrix-shape strip (`4 × template width → 4 × 128 → 4 × 1`) exists because a caption
tried to carry padding, row-count invariance, and width narrowing at once.

**LinkedIn distribution (the recipe that worked):** capture a demo's steps with
reserved-space bands collapsed, assemble in Pillow with 150 ms cross-fades, ~660 px,
3–5 s holds. The composer rejects all scripted media attachment (isTrusted), so the
file gets dragged in by hand. Frame the post on the *upset and the general lesson*, not
on "here is a bug I found" — the transferable claim ("what a model can learn is capped
by how you let it answer") is what earns a repost.

### 4. What the Network Sees — NEXT
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

**MAKE THE VISIBILITY MODEL A HEADLINE SECTION** (user, 2026-08-14): "how to track
visibility intelligently — a card moves from a public container to a hidden one and you
still know it's there." This is the most designer-legible idea in the post and it
generalizes past Jaipur, so it deserves its own Concept block and demo rather than a
bullet. The material is already built and mostly written up in `docs/ml/README.md`:

- **A hidden zone is not an opaque zone.** Visibility is a property of the *container*,
  but knowledge is a property of the *history*. Counting what is in an opponent's hand
  is the naive read; tracking what you WATCHED go in is the correct one. Same container,
  strictly more knowledge, no cheating.
- **The two-line model** (the generic mechanism): the engine carries
  `GameState.public_line` (what a spectator saw — action names always, a chosen card
  only when chosen face-up, a face-down pick records `?`) plus per-seat
  `private_lines`. The information-set key is observation + public line. Concrete
  payoff: Leduc keys to 936 information sets with the public line and 576 without —
  and the 576 version is *silently imperfect-recall*, i.e. a game that has forgotten
  something it saw. That number pair is the whole argument in one line.
- **Reveal-to-one** (era 13): Love Letter's Priest peek appends to the RECEIVING seat's
  private line and nothing public, so a peek splits the peeker's information sets and
  nobody else's. This is the exact primitive a designer means by "I looked at your
  hand." Every reveal-free game keys byte-identically to before the channel existed.
- **The counter-story, and it is a good one: the ACTION SPACE can leak.** The gap-5
  tripwire (`masking.legal_codec_names`) fails loud when a component choice would offer
  an option the chooser cannot see, because naming a face-down card by its true template
  would leak the hidden face into the list of legal moves — the Skull clairvoyant-flip
  bug (era 12). Post 3 was about the action space having the wrong NAMES; this is the
  action space knowing too MUCH. Nice symmetry, use it.
- **Where honesty required refusal:** games whose public line cannot be keyed honestly
  are refused at the adapter door (`assert_public_line_is_sound`) — sealed bids (For
  Sale), simultaneous-move loops (Incan Gold, where the engine serializes and the line
  would hand a later seat an earlier seat's choice). Refusing to model something you
  cannot model honestly belongs in the same instrument-honesty thread as post 3's
  yardstick and post 5's TrueSkill σ.
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

**SURVEY THE FIELD, do not just describe ours** (user, 2026-08-14). The user wants a
clear map of what searches exist and how the flavours differ — this is a headline
requirement for the post, not a sidebar. Structure the survey on the axes that actually
separate the algorithms, so a reader can place any new one they meet:

1. **What happens at a leaf?** Hand-written eval / rollout to the end / a value net.
2. **What decides where to look?** Full width / alpha-beta pruning / UCB statistics /
   a learned policy prior (PUCT).
3. **How is uncertainty handled?** Max nodes only (minimax) / chance nodes
   (expectimax) / sampled worlds (determinization) / beliefs carried explicitly
   (ReBeL, GT-CFR).
4. **What is backed up?** Max, average, or regret.

The families to place on that grid, all of which the repo has met: minimax +
alpha-beta; **expectimax** (Keldon's 2-ply); plain **UCT** with random rollouts;
**PUCT / AlphaZero**; **rollout policy improvement** (era 19: cheap 1-ply beats every
raw MMD bot, and it is servable); **determinization / PIMC** with its
**strategy-fusion pathology** (`strategy-fusion-explained.md` has the worked Jaipur
example and the toy P/Q table — lift it, it is already near-blog voice; Long et al.
2010 for why PIMC is safe for trick-taking and pathological for bluffing);
**ISMCTS-BR** as the exploitability instrument (arXiv:2004.09677); and the
**CFR family** as the thing that is NOT play-time search but a solver, with **GT-CFR /
Student of Games** (`gtcfr-exploration.md`) as the principled unification of the two
halves. Cite the frontier survey (`docs/ml/frontier-lit-survey-2026-07-16.md`) for the
"tiny enumerable hidden state" argument: most celebrated belief machinery exists to
approximate beliefs we can simply enumerate.

**The thread that makes the survey land, not just enumerate** (user's own observation,
2026-08-14, from the live RFTG arc): *a value-only search is beating us.* Keldon's RFTG
bot is a 704 → 50 → 2 value-only net, TD self-play over 30,002 games, inside a **2-ply
full-width expectimax** — no policy head anywhere (`rftg-parity-curve.md:1-6`). Our
AZ-shaped agent loses to it. The honest reading: the policy prior in PUCT is a
*sampling device for branching factors you cannot afford to enumerate* (Go's ~250), and
where the branching is modest, full-width shallow lookahead over a good value function
can spend the same compute better. AlphaZero is one point in the design space, not the
top of a ladder. The post should say this plainly — it is the same
representation-beats-capacity lesson post 3 ends on, arriving from the search side.
Check the arc's state before drafting; it is live and the numbers will move.
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

### 6. The Vocabulary of Board Games — for designers, not engineers
**The change-of-pace post** (user, 2026-08-14). Two heavy technical posts in a row
(perception, search) earn a break, and the primitive catalog is ready to carry it.
Audience: the game-design community (BGG design forum, r/tabletopgamedesign, Ludology
listeners) — people who care what the atoms of a game ARE, not how a net encodes them.
Little to no ML content; this post must stand alone for a reader who skipped 1-5.

**The claim, and it is a real one:** every board game we have shipped is written from a
finite vocabulary, and the vocabulary is small. Measured from `grimoire/primitives.py`
+ `primitives_usage.py` on 2026-08-14: **161 primitives, 11 families, 21 games**.

- **Nine primitives appear in all 21 games**: containers, components, phase, loop,
  turns, action, stock, determine_winner, expressions. That is the irreducible core —
  places, pieces, phases, a loop, turns, things you may do, a starting arrangement, and
  a way to decide who won. State it as the finding it is.
- **Sixty-five appear in exactly one game.** Each one is a game that demanded something:
  Checkers wanted `is_forward` / `midpoint` / `diagonal_distance`; Coup wanted `poll`
  (the challenge/block window) and `__poll_responder__`; For Sale wanted
  `resolve_by_rank`; Jaipur wanted `no_shared_property`. The long tail IS the design
  history — you can read which mechanic forced which word into the language.
- **Only two primitives are unused by any shipped game**, which is the honest measure of
  whether the vocabulary was designed or discovered. (It was discovered: grow-primitives-
  organically is a CLAUDE.md rule, and the catalog is its receipt.)
- The most-written verbs are mundane and that is the point: `adjust_resource` (410 uses,
  16 games), `count(...)` (378), `move` (281), `if` (208).

**The hook to test-drive:** "I catalogued every rule a board game can have. There are
about 160." Follow with the nine universals as a list a designer can check their own
design against.

**Shape:** the catalog UI is already built (`viewer/pages/primitives.vue`, screenshots in
`screenshots/primitives/`) and is the natural centrepiece — a browsable palette with per-
primitive usage counts and worked examples pulled from real games. Consider embedding a
trimmed interactive version rather than screenshots. A one-game teardown (Jaipur or For
Sale, whole game named primitive by primitive) is the obvious closer. Zipf-ish usage
curve = legitimate matplotlib data graphic.

**Cross-link, do not lean on:** the series' AI thread is what MEASURES the vocabulary
(a game the pipeline can learn is a game the vocabulary expressed correctly), and post 7
picks that up directly. One paragraph, not a section.

### 7. One Pipeline, Every Game
**Era 4.** The generalization sweep: which of 12 games actually learn. 5/6 learn past
random *after* the reward/eval orientation fix, and the fix is the story — three broken
score shapes (winner-only, lower-is-better, 4-player) all traced to assuming Jaipur's
shape. Checkers and Coup blocked. `ml2-first-curve.png` belongs here.

### 8. A Thousand Times Faster (and where that wasn't enough)
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

### 9-13. Sketches
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

### 14-16. The live log (none of this has happened yet)
- **Race for the Galaxy** — the authoring arc (R1: 95 cards, one new primitive), then
  the Keldon yardstick (see Standing re-evaluations below).
- **Press the Button** — autonomy; every champion so far was hand-shepherded, and the
  product is the unbuilt part.
- **Nobody Writes YAML** — the designer surface; post 1's bridge-from-the-designer's-
  side claim made true.

---

## Debts from published posts

Things an earlier post left out or simplified, which a later post must square. Not
corrections to the record (field-notes voice means a post claims only what it knew) —
just gaps that will otherwise compound.

**The value head, glossed in Part 2.** Part 2 taught PPO as "stamp the outcome
backward and nudge," which is the REINFORCE-shaped story; PPO is actor-critic, and
sb3's MaskablePPO was computing advantages from a value head on every update the whole
time. Part 2 never names it (an earlier CreditDemo caption did, and the caption was
lost in a redesign). **Post 3 pays this off** in its trunk/head anatomy paragraph: one
trunk, two heads, and PPO judging results against what the value head expected so
credit tracks surprise rather than luck. Post 5 then makes the value head the main
character, since a weak one is exactly what made search degrade a perfect policy.
Watch for the same failure mode elsewhere: a simplification that is fine in isolation
becomes a hole once a later post needs the machinery.

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
