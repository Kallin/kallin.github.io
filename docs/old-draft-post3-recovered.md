I've been building a tool where you describe a board game in a text file, and an engine plays it. Not code: a declarative file that says what the pieces are, where they go, and what a turn looks like. Jaipur, Ticket to Ride, Star Realms, a dozen others, each a few hundred lines of YAML.

The reason to build it that way is the last step. If a game is just data, then one AI should be able to read that data and learn to play, any game, with no game-specific code. That's the whole bet: a single pipeline that learns Jaipur and Sushi Go and Checkers, because it never knew which one it was playing.

My first attempt at that AI lost every single game to 200 lines of if-statements.

This is the first post in a series about clawing my way up from that. I came in knowing the vocabulary of machine learning, gradients, loss functions, the shape of a training loop, but I'd never actually had to *do* it: to find weights that work, to design how a game gets fed to a network, to shape what the network even outputs. That turns out to be the entire game. This post is the first hard lesson, and it's a good one, because the fix was the opposite of what I reached for.

## The bet

Here's the naive version of the plan, which is the version I built first.

A neural network is a function. It takes numbers in, multiplies them by a big pile of other numbers (the *weights*), bends the result, and produces numbers out. Training is the search for weights that make the outputs good, nudged a little at a time by a loss function that measures how wrong you were. I knew all of that going in. What I hadn't appreciated is that the numbers going *in* and the numbers coming *out* are decisions you make, and they matter more than anything that happens in between.

So: how do you turn a game of Jaipur into numbers?

You write down the state as a flat list. How many cards of each kind are in the market, how many camels you're holding, how many points each player has banked, whose turn it is. For Jaipur that came out to 78 numbers. That list is the **observation**, everything the network gets to see.

Those 78 numbers flow into a stack of layers, the **trunk**, each one a matrix multiply followed by a squash. The squash is where a lot of newcomers (me) go "wait, what is that." It's a function like `tanh`:

![The tanh activation function, an S-curve that maps any input to a value between -1 and +1](/images/posts/ml1-tanh.png)

*`tanh` takes any number, however large, and gently crushes it into the range -1 to +1. Without a squash like this, stacking layers is pointless: a pile of matrix multiplies collapses into one big matrix, and your "deep" network can only ever draw straight lines. The squash is the kink that lets the network bend, and bending is the whole point.*

Out the other end, the trunk produces two things through two small **heads**. The **policy head** answers "which move should I make?" The **value head** answers "am I winning?" Same body, two opinions.

![The naive pipeline: a .grim game file becomes a 78-number observation, which flows through a neural net trunk into a policy head and a value head, with a self-play loop feeding back in](/images/posts/ml1-pipeline.png)

To train it, I wrapped the engine as a standard reinforcement-learning environment, the same [Gymnasium](https://gymnasium.farama.org/) interface everything in the RL world speaks, so I could point off-the-shelf trainers at it. Then I set it playing itself. **Self-play** is exactly what it sounds like: the network plays thousands of games against a copy of itself, and every game is a little pile of training data. Won that game? The moves you made were probably good, do more of that. Lost? Less of that. The algorithm doing the nudging was PPO, a standard and well-behaved one. I didn't write it; I imported it. That was the point.

And it worked, in the sense that the network got better at beating earlier versions of itself. The win rate against last week's model kept climbing. I felt good about it.

## The yardstick

Here's the trap I'd walked into, and it's a subtle one. "Beats last week's model" is a treadmill. If your whole lineage is bad, a new model that beats the old one is just *less bad*, and you have no way to know it. You're measuring movement, not altitude.

So I built a yardstick. Fixed reference opponents, ranked on a single skill scale (Elo, the chess rating system, works for anything you can play head-to-head). At the bottom, an agent that plays random legal moves. At the top, a hand-coded **heuristic**: a couple hundred lines of obvious Jaipur principles. Sell sets when they're worth a bonus. Take the high-value goods. Hoard camels. Dump leather. Nothing clever, nothing learned, just a competent player's rules of thumb written out as `if` statements.

Then I put my trained networks on the ladder.

![Elo ladder: random at 0, our best trained net at 591, net-plus-search at 648, the hand-coded heuristic far ahead at 1081. Annotations note the nets win 0% and 8% of games against the heuristic](/images/posts/ml1-humbling.png)

My best network won **zero percent** of its games against the if-statements. Not "lost narrowly." Zero. Bolting on a search routine to look a few moves ahead got it to eight percent. The heuristic sat about 400 Elo points above everything I'd trained, which in this scale means "wins essentially always."

Months of self-play, and the thing couldn't beat a list of rules of thumb that took an afternoon to write. That's a bad day. But it's the *good* kind of bad day, because now I had a number that told the truth, and a real question: what is the network so bad at?

## Two nulls and a hunch

My instincts were all wrong, and I want to be honest about that because being wrong here is the whole lesson.

First instinct: the network is too small. It can't hold enough Jaipur in its head. So I made it bigger. Doubled the width, added depth. **No change.** Not a little change, no change.

Second instinct: it hasn't trained long enough. So I let it run much longer. **No change.** A flat line.

Two dead ends. When "bigger" and "longer" both do nothing, they're telling you something: the ceiling isn't capacity, and it isn't training time. It's somewhere else entirely. The one thing that *did* move the needle, in a separate experiment, was changing what the network could see, giving it the composition of each zone instead of just the count of cards in it. That was worth ten points. Same net, same training, richer observation. That was the tell:

> Capacity wasn't the ceiling. Optimization wasn't the ceiling. **Information was.**

So I went hunting for the specific piece of information the network was missing. It was hiding somewhere much stranger than the observation. It was in the *output*.

## The bug was in how it named its moves

Here's the thing I didn't understand about my own policy head.

When the network wants to say "take the diamond," it has to point at the diamond somehow. My setup gave every possible move a numbered slot, and the network learned a weight for each slot. Slot 50 means "take this thing." Fine.

Except *which* thing slot 50 points at changes every single turn. The engine sorted the available cards by an internal ID and handed out slots in order. So slot 50 might be the diamond this turn, and the cloth next turn, and a camel the turn after that. The slot number was a seating chart that got reshuffled before every hand.

![Two panels. Left, labelled 'flat head': slots 48 through 52, and slot 50 holds diamond on turn 1 but cloth on turn 2. Right, labelled 'pointer head': a single shared scorer reads each candidate card's features and assigns each a score](/images/posts/ml1-codec.png)

Look at the left side. The network is trying to learn "slot 50 is good." But slot 50 has no fixed meaning. Its weight for slot 50 is being trained, one game, to love diamonds, and the next game to love cloth, and these cancel out into mush. A fixed weight *cannot* learn a value that isn't stable. There's nothing to learn.

I could prove this was the bottleneck. A little classifier that just looked at the same 78 numbers and predicted "which good would the heuristic take here" got it right 96% of the time. The information was *right there* in the observation, plenty to make the decision. But my network's policy, forced through those shuffling slots, topped out around 80%, no matter how big or how long I made it. That gap, 80 versus 96, was almost the whole ladder.

## The pointer head

The fix has a name, borrowed from a 2015 idea called pointer networks, and once you see it it's obvious.

Stop learning a weight per slot. Instead, learn *one* scoring function, and show it each available card's actual features: this is a diamond, it's worth 7, I'm holding one already. The function reads those features and outputs a score. Run it over every legal card, and the highest score wins. That's the right panel of the diagram above.

The difference is everything. A slot has no meaning, so the old head had to relearn "diamonds are good" separately for every slot, and they kept reshuffling out from under it. The pointer head learns "diamonds are good" *once*, as a fact about diamonds, and applies it wherever a diamond happens to appear. The move binds to *what it is*, not to where it landed in an arbitrary list.

I swapped the head and retrained. Nothing else changed.

![Before and after bar chart. Take-good accuracy goes from 80% with the flat head to 96% with the pointer head. Win rate against the heuristic goes from 18.5% to 48.5%](/images/posts/ml1-fix.png)

The card-picking accuracy jumped from 80% to 96%, exactly the classifier's number. And the win rate against the heuristic went from a hopeless 18.5% to 48.5%. That's a statistical tie with the thing that had been shutting me out completely.

I want to sit on that for a second, because it's the lesson of the whole post. I didn't add a single parameter of capacity. I didn't train a minute longer. I changed *how the network refers to its own choices*, and it went from unable-to-compete to even. The bottleneck was never in the network's brain. It was in the network's vocabulary.

## Parity isn't winning

A tie with a couple hundred lines of if-statements is not a victory. It's a starting line.

And here's where I got humbled a second time, which I'll tell on myself because it matters. Having reached parity, I ran every lever I could think of to pull *ahead*, and they all landed at a tie too. So I wrote it up: Jaipur has a skill ceiling, the heuristic is basically at it, this game is too luck-heavy and shallow to reward anything smarter. I was confident. I'd checked it three ways.

I was wrong, and I found out the same day.

## One reward change

The tie was hiding two mistakes, and the second one is beautiful.

The first: I'd been training the network by *imitating* the heuristic, copying its moves. But a student who copies the teacher can, at absolute best, match the teacher. Imitation has parity baked in as a ceiling. To beat the heuristic, the network had to learn from scratch, from its own self-play, having never seen the heuristic at all.

The second mistake was in the reward, and it's the kind of thing that's obvious only in hindsight. I'd been rewarding the network for its *own score*: get more points, good. Sounds right. It's not. Jaipur is a two-player fight, and a player optimizing their own score is playing solitaire. What you actually want is to *outscore your opponent*. So I changed the reward from "my points" to "my points minus theirs." A zero-sum margin. One line.

That one line is the difference between a game you're playing next to someone and a game you're playing against them. And it broke the whole thing open.

![Training curve from zero. The win rate against the heuristic sits in the teens for about 150 iterations, then breaks out sharply, climbing past the 50% parity line to around 70%. Milestone points labelled 13%, 34%, 58%, 64%, 70%](/images/posts/ml1-breakout.png)

Look at that curve. For about 150 iterations it sits in the teens, flat, going nowhere. Every instinct says kill it, it's dead, the ceiling was real. Then it breaks. 13%, 34%, 58%, past the parity line, up to 70%. A network that had never once seen the heuristic was now beating it roughly two games in three. The ceiling I'd been so sure about was self-imposed, an artifact of copying a teacher and rewarding the wrong thing. The game had plenty of headroom. I'd been standing on the brakes.

## Against a human

There's one more number I care about more than any ladder.

The old, hopeless model, the one that lost to if-statements, I'd also played against a real person on Board Game Arena. It lost, 84-56 and 86-58. Not close.

The new from-scratch champion played the same kind of match. It won, 82-75 and 81-72. Two games, both to the network.

It's a small sample and I won't oversell it. But it's a clean flip: the exact setup that lost to a human now wins, and it got there by learning a different way to play than the heuristic ever knew, running an engine of camels and exchanges the rules of thumb never considered. That's the moment the bet started to feel real.

## What finding good weights looks like

I'll leave you with a picture. This is the first layer of that champion network, the 19,968 numbers it settled on, plotted as a landscape.

![A 3D surface plot of the champion network's first-layer weights, a rugged landscape of nearly 20,000 learned values in blues and rusts](/images/posts/ml1-weights.png)

There's no legend for this. No single weight means anything you could name. It's just the shape that "beats the heuristic and a human at Jaipur" happens to take, found by nudging, a little at a time, across millions of games. When I started I thought the hard part of machine learning was the math in the middle, the gradients and the losses I already sort of knew. The hard part was the two ends: deciding what the network sees, and deciding how it speaks. The middle mostly takes care of itself. The 78 numbers going in and the pointer head coming out are where all my wins and all my losses actually lived.

## Where this goes

So I have a network that plays one game about as well as a person. That raises the question the rest of this series is about: is it actually *good*, or just good enough to beat me?

To answer that honestly I had to stop grading it against myself and my own heuristic, and start hunting for its blind spots on purpose, training dedicated adversaries whose only job is to exploit it. That's **Part 2**: leagues of exploiters, searching the game tree at play time with IS-MCTS, and a genuinely mind-bending result about imperfect information called strategy fusion, where I'll show you how giving a search engine *more* knowledge of the hidden cards somehow made it play *worse*.

Then **Part 3** is the original bet finally cashed: does this same pipeline, unchanged, learn all the other games? What it takes to run these experiments as broad sweeps in the cloud, why a laptop CPU is the real wall and what to do about it, and the frontier I'm circling now, the game-theory machinery (CFR, the math behind superhuman poker) that might take this past "beats a person" toward "provably hard to beat."

It started with losing to an if-statement. It gets stranger from here.