---
title: 'Tracing Ontario’s $244 Billion Budget — and Where It Disappears'
description: 'I built an interactive tool to trace Ontario’s $244B budget as deep as the public data allows, honestly tagging every number as verified, estimated, a government black box, or classified. Here’s what I found — and why AI changes what civic analysis can do.'
pubDate: '2026-05-06'
tags: ['civic-tech', 'ai', 'data-transparency', 'ontario']
---

I’m a software engineer by day, but civic tech is something I care deeply about. So I spent some time this week — half-watching *The Pitt* — building [an interactive tool to trace Ontario’s $244 billion budget](https://glowing-torte-c0235a.netlify.app/) as deep as the public data allows.

You can drill from the top level down into the things a budget is actually *made of*: individual school boards (all 72, with verified allocations), named hospital capital projects, transit megaprojects with independent cost tracking, and social programs. Revenue comes in at $231.9B against $244.2B in expenses — a $13.8B deficit — and from there you can keep clicking down until you hit the limit of what’s public.

## Every number is tagged for honesty

The thing I care most about isn’t the visualization — it’s that **every single number is honestly labeled** with where it came from and how much you should trust it:

- 🟢 **Verified** — a published government figure you can trace to a source.
- 🟠 **Black box** — the government tracks this internally but doesn’t share it publicly.
- 🟡 **Doesn’t exist in this form** — the public data simply isn’t broken out this way; where I’ve approximated, it’s flagged as an estimate.
- 🔴 **Classified** — genuinely restricted.

Most budget dashboards quietly paper over the gaps. This one refuses to. If a number is a guess, it says so. If the province *has* the data and won’t release it, the tool calls that out by name.

## The findings

When you tag everything honestly, the shape of the problem becomes obvious:

- 🟢 **29%** verified from published sources
- 🟠 **34%** black box — tracked internally, not shared publicly
- 🟡 **35%** the data doesn’t exist in this form
- 🔴 **2%** classified

That middle band is the headline: **$172 billion in provincial spending sits in government systems they maintain but choose not to open to the public.** That’s a transparency problem. It’s also an opportunity.

## Why this is suddenly possible

AI makes a new kind of civic analysis possible. Pulling this together meant synthesizing 72 school-board PDFs, 388 municipal grant tables, auditor general reports, individual agency financial statements, and ministry expenditure estimates into one coherent, interrogable picture — and flagging every gap along the way. That’s a volume and heterogeneity of source material that would have made this a multi-person, multi-month project a couple of years ago. Now it’s a side quest you can knock out while binging a hospital drama.

That shift matters more than the tool itself. **Government data isn’t hidden because it’s technically hard to publish — it’s hidden because nobody has built the infrastructure to aggregate, question, and present it at scale.** That’s changing. I think the next wave of civic-engagement tools will be built on exactly this capability: taking the black boxes and making them visible.

Have a dig through it yourself — [trace the $244B here](https://glowing-torte-c0235a.netlify.app/) — and tell me what you find.
