---
title: 'Understanding Complexity Density: A New Approach with RuboCop'
description: 'A RuboCop cop I proposed — Metrics/SingleLineComplexity — that applies the ABC metric per line to measure "complexity density" and flag the individual lines packing in too much logic.'
pubDate: '2025-01-16'
tags: ['tech', 'coding', 'ruby']
---


A while back I built a RuboCop check around an idea I call "complexity density" — using the ABC metric to flag individual lines of Ruby that pack in too much logic. I [proposed it to RuboCop](https://github.com/rubocop/rubocop/pull/13595) as a new cop, `Metrics/SingleLineComplexity`. A maintainer engaged with it and helped sharpen the tests, but I didn't push it over the finish line — the PR went stale and was eventually auto-closed, so it never shipped in RuboCop itself. The idea still holds up, though, and it's small enough to drop into a project as a custom cop or package as a standalone gem.

This post explains what complexity density is and why I still think it's the more interesting thing to measure.

# Why 'Complexity Density'?

The idea for this new RuboCop cop emerged during a lively Slack discussion at work. The team was debating whether a particular line of code contained 'too much logic' to be 
maintainable. Here’s a simplified and obfuscated version of the line in question:

```ruby
entity.foo? && !entity.bar? ? entity.components.processed.sum(&:value) : entity.value
```

This single line packed conditional logic, method calls, and a ternary operator, making it hard to quickly grasp its purpose. After much back-and-forth among team members about whether this individual line was 'too complex', I wondered: how could we quantify this?
Could we move beyond subjective debates and provide an objective threshold for identifying overly dense lines of code?

# A Refresher on the ABC Metric

The ABC metric quantifies complexity based on three factors:

Assignments (A): variable assignments and reassignments (`=`, `+=`, …).

Branches (B): method calls and message sends — each call "branches" execution off to another piece of code.

Conditionals (C): conditional and comparison logic (`==`, `<`, `>`, `&&`, ternaries, …).

It is a well established method for measuring complexity in code, and RuboCop already includes a cop, `Metrics/AbcSize`, that uses the ABC metric to identify complex methods.

The Score is calculated as the vector length of the 3 ABC values:

![Formula](https://latex.codecogs.com/svg.latex?\sqrt{a^2%20+%20b^2%20+%20c^2})



In the earlier example code:
```ruby
entity.foo? && !entity.bar? ? entity.components.processed.sum(&:value) : entity.value
```
We have 0 assignments, 11 branches, and 3 conditionals, resulting in an ABC score of 11.4.


# Why Focus on Lines?

Consider a method that scores well on complexity metrics but contains a single line that combines multiple assignments, branches, and conditions. 
With the current AbcSize Metric, it doesn't matter if that logic is spread across 10 lines, or packed into one. 

For Example, here is some code with an ABC score of 10.3 (3 assignments, 9 branches, 4 conditionals). 

Spread across 11 lines:

```ruby
def sensible_method
  if x > y
    if y > z
      log_foo
      a = foo
    else
      log_bar
      b = bar
    end
  else
    c = baz
  end
end
```

Packed into one line:

```ruby
def sensible_method
   x > y ? (y > z ? (log_foo; a = foo) : (log_bar; b = bar)) : c = baz
end
```

Up until now, there is no way to distinguish between these two methods using ABCSize. The method has a score of 10.3 in both cases.
However, using this new SingleLineComplexity cop, the second example would be flagged as having a high complexity density, while the first would not.

# Future Improvements

This new cop checks complexity per line, which is useful, but does not entirely capture the concept of 'complexity density'. 

Looking at complexity density as a ratio of complexity to lines or complexity to characters, rather than just focusing on one line at a time, 
could provide a more nuanced view of code complexity.

# Conclusion

A per-method complexity check can't tell whether logic is spread cleanly across ten readable lines or crammed into one inscrutable one — both score the same. Measuring complexity *per line* surfaces exactly the dense, hard-to-parse lines that slip past `AbcSize` and `LineLength` alike.

The cop is small enough to drop into a project as a custom cop, or to package as a gem — the [PR](https://github.com/rubocop/rubocop/pull/13595) has the implementation and tests if you want a starting point. And I still think "complexity density" — complexity weighed against the lines or characters it's spread across — is a more useful unit to measure than either raw per-method ABC or line length on its own.
