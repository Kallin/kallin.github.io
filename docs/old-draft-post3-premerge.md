---
title: 'Beaten by an If-Statement'
description: "Part 3: beating a random player essentially every game proves almost nothing. Building an honest measuring stick, discovering that the entire trained lineage sits below a few hundred lines of hand-written priorities, and watching the obvious fix fail to close the gap."
pubDate: '2026-08-05'
tags: ['ai', 'ml', 'reinforcement-learning', 'games']
draft: true
series: 'game-ai'
seriesOrder: 3
---

import Concept from '../../components/Concept.astro';
import EloDemo from '../../components/EloDemo.astro';
import ZoomImage from '../../components/ZoomImage.astro';

[Last time](/blog/game-ai-from-random-to-reasonable/) ended with a complaint about my own numbers. The agent beat a random player essentially every game, it beat its own previous versions, and none of that told me anything, because every opponent it had ever faced came from inside its own little world. I said the next job was a real yardstick, and that I had no idea what it would say.

The answer was that everything I had built played below the level you reach by writing down the obvious rules of the game and following them. Nothing was broken. Nothing was buggy. The agent had genuinely learned, and where it had learned its way to was much lower than I thought.

This post is how I found that out, and what happened when I tried the obvious fix.

## What a yardstick actually has to do

The problem with "version 3 beats version 2" is not that it is false. It is that it measures the wrong thing. It tells you the ordering inside a family and nothing about where the family sits.

So the requirements are easy to state. I need an opponent from *outside* the family, one that does not change when my agents change. And I need a scale, because pairwise win rates do not compose: knowing A beats B 60% of the time and B beats C 60% of the time does not tell me what happens when A plays C, and it certainly does not tell me how far apart they are.

The scale part is a solved problem, and the solution comes from chess.

<Concept title="Elo: turning who-beat-whom into how-far-apart">
A win rate is a fact about a pair. A rating is a fact about a population: one number per player, chosen so that the *differences* between them predict the results of every matchup at once. Step through how a ratings table falls out of a pile of game results:

<EloDemo />
</Concept>

The property that matters for my purposes is the one at the end: a rating is only meaningful relative to the field it was measured in. If every player in the pool is bad, the ratings will happily spread themselves across that pool and tell you nothing whatsoever about the outside world. Which means the entire value of the exercise depends on getting one genuinely competent player into the field.

## Building the thing

The competent player had to be hand-written, because nothing else was available. A few hundred lines encoding what any human works out in their second game of Jaipur.

I want to be precise about how unambitious it is, because it matters later. Its own docstring says so:

> Not optimal, deliberately: it encodes the obvious Jaipur principles (sell sets for bonus tokens, grab high-value goods, keep camels for exchanges, dump leather) so that "beats this" means "at least decent."

It is a priority list with thresholds, and the thresholds are named so that the strategy reads as intent rather than as arithmetic:

```python
_HIGH_TOKEN = 5           # "this good's tokens are worth cashing now"
_MIN_TAKE_PRIORITY = 3    # don't burn a turn taking a lone low good
_CAMEL_TAKE_MIN = 2       # take camels when the market has a pile of them
_SET_NUDGE = 0.6          # prefer goods we're already collecting
```

That last one is the only subtle thing in it. It nudges the bot toward goods it already holds, because the bonus tokens for selling three, four or five cards at once are what actually decide Jaipur games. One coefficient, expressing "build toward a set."

Before trusting it to judge anything, I checked it was worth trusting. It played 640 games against the random bot and won 640 of them, with zero illegal moves attempted. That number is going to show up again shortly, in a context I liked considerably less.

Around that went the rest of the apparatus: a zoo of reference agents that could be assembled from a spec, a round-robin harness that plays every pair with the seats balanced, and a ratings table computed over the whole field at once rather than pair by pair.

And then two attempts at something better than a ladder, both of which failed.

## The two kinds of truth I couldn't have

A rating tells you where players sit relative to each other. It does not tell you where *perfect* is. For a small enough game you can get that directly: search the entire tree, and what comes back is not an estimate, it is the answer. Checkers was settled this way in 2007, and the answer is that a perfectly played game is a draw.

So I wrote an exact solver, alpha-beta over the endgame, and checked it against tic-tac-toe, where it correctly reports that good play draws.

Then I pointed it at Jaipur and it did not come back.

The culprit is the exchange action, which lets you swap any number of camels and unwanted cards against any combination of goods in the market. That is a combinatorial fan-out at every single node, and it does not thin out as the deck empties. Positions with one card left still blew the budget.

There is no brute-force ground truth for this game. Not with more patience, not with more machines.

The second attempt was cheaper in principle. If you cannot compute the perfect move, you can approximate a very strong one: at each decision, play the game out to the end many times at random, and pick whatever wins most often. No network, no training, just brute-force sampling. That is not perfect play but it is a genuinely strong reference, and it is the closest thing to an outside opinion I could construct without hand-writing another strategy.

It works. It is also far too slow to use. Playing out thousands of continuations at every decision, for every game, for every pairing in a round robin, put it hours beyond the budget of the ladder, so it got built and then left out of the field it was built for.

So both routes to a better yardstick closed: one intractable, one unaffordable. What I actually had was a hand-written bot and a rating scale, which is a much weaker instrument than I wanted.

That is worth sitting with, because it is a permanent condition rather than a temporary one. On any game in this project worth studying, I am never going to know what perfect play looks like. Every judgment will be relative to some other player. The best I can do is make sure that other player is honest, which is turning out to be a much harder problem than I expected when I started.

## The number

Four agents in the field: the trained network from last post, that same network with a lookahead search wrapped around it, the hand-written heuristic, and a random player pinned at zero to anchor the scale. Fifty games per pair, both seats, every pairing.

<ZoomImage src="/images/posts/ml3-elo-ladder.png" alt="Elo ladder: random anchored at 0, the trained policy at 591, the same policy with search at 648, and the hand-written heuristic at 1081, with the 433-point gap between search and the heuristic marked" />

The heuristic sits at 1081. The trained network sits at 591. Search buys 57 points on top of the network, which is real, and leaves it 433 points short.

The pairwise numbers are worse than the ratings make it sound. The heuristic beat the searched agent in 92% of games. Against the bare network it went **100%**. Both seats, not a single loss.

That is the same score it posted against the random bot.

It is worth checking that against the curve, because the two halves of this measurement were computed independently and they agree. Feed a 433-point gap through the conversion from the demo above and it predicts the favourite wins 92.4% of the time. The observed number was 92%. The ratings are not smoothing anything over or flattering anyone: the gap really is that size, and the games really do go that way.

I had spent weeks watching that network learn. It went from placing cards at random to building hands around one good, clustering its sales into sets, scooping camels when the market was thick with them. All of that was real. I sat down across the table from it and found an opponent there.

And it cannot take one game off a few hundred lines of if-statements.

Both of those are true at once, and holding them together is the actual content of this post. The learning was not fake. The version-over-version progress was not fake. It was all happening inside a band of play that a competent human leaves behind in their second game, and nothing I owned could see the ceiling above that band, because every instrument I owned lived inside it.

Which is what "beats random" was hiding. Random is not a floor near the bottom of the interesting range. It is a floor far *below* the interesting range, and clearing it by a wide margin turns out to be entirely compatible with being nowhere at all.

## The obvious fix, and why it didn't work

There is a well-known answer to "my network plays below the level I want," and it is the one that made AlphaGo work. Stop asking the network to be right in a single shot. Give it time to think: let it look ahead, play out consequences, and use that search to choose a better move than the raw network would have chosen. Then train the network on what the search chose, so the thing generating the training data is always a little stronger than the thing being trained. A ratchet rather than a fixed point.

The first thing that happened was that search made the agent worse.

Not everywhere, but on the decision that had the least room for improvement: the top-level choice of which of the four actions to take. There the network already agreed with the heuristic 100% of the time. Wrap it in search and agreement fell to 83%. Lookahead was taking a policy that was already perfect and talking it out of the right answer.

That looks exactly like a bug, and I was fairly confident it was one. So the whole search stack got audited: the tree code, the state cloning, the value backup, the sign conventions, the way network values were consumed. Five separate passes, each one hunting for the same defect from a different angle.

There was no bug. The audit came back clean, and the explanation it left behind was worse than a bug would have been. Search was faithfully doing what search does, which is trust the value function about positions it cannot play out to the end. My value function was weak enough that on roughly one action in twenty it preferred a genuinely worse move, and a correct search built on top of a bad judgment is just an efficient way to arrive at bad judgments.

That fix is the one piece of this post that went right. Replacing the crude win-or-lose value with one that tracks the running score margin gave search something reliable to lean on, and the degradation vanished on the spot: 100% agreement in, 100% agreement out. With that in place the loop improved on its own starting point for the first time, from about 20% against the heuristic to 29%.

So the teacher does exist. Search is worth roughly ten points over the bare network, once the value underneath it is honest.

The second half is where it fell over. If search is what makes the agent stronger, then more search should make it stronger still. I gave it four times as much: 512 positions per move.

It scored 21%.

Inside the noise, and if anything slightly worse. Four times the compute for nothing. The gain from lookahead saturates almost immediately on this game, and it saturates *below the heuristic*, which means the ratchet has nothing to bite on. You cannot bootstrap a network toward a teacher that is itself stuck.

Why it saturates is a property of Jaipur rather than of my code, and it took me a while to accept. Chess and Go reward deep lookahead because they have forcing lines: sequences where consequences are concrete and one specific move order matters enormously. Jaipur has almost none of that. The games are short, the deck injects fresh randomness constantly, and the value of a position is mostly about its shape rather than about a tactic four moves out. Searching further in a game like this mostly buys more branches of noise.

So the AlphaZero-shaped answer is not the answer here. That is not a knob I set wrong. It is a mismatch between the method and the game.

## Where that leaves it

Four things are ruled out, which is more progress than it feels like.

It is not the learning algorithm. PPO is the workhorse of the field, and it gets used on problems far harder than a two-player card game.

It is not a defect in the machinery. The one component I had real cause to suspect got taken apart five ways and came back clean, and the thing the audit found instead was fixed and made search behave.

It is not the compute. Four times the search bought nothing, and the ten-times-bigger network from last post bought nothing either. Whatever is wrong here is not starved of resources.

And it is not that the game is too hard, because a few hundred lines of hand-written priorities play it decently. Everything the heuristic knows is expressible, and it is sitting right there in a file in about as plain a form as a strategy can be written.

So: the network is failing to learn something demonstrably learnable, using an algorithm that demonstrably works, with resources that are demonstrably sufficient.

Which leaves the part I had not been looking at. Not the learner, and not the game, but the channel between them. What I am actually showing the network, and what I am actually asking it to say back.

I have started pulling on that thread, and I do not like what I am finding.
