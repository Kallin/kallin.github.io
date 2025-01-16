---
layout: post
title: "Understanding Complexity Density: A New Approach with RuboCop"
tags: tech coding ruby
---


Recently, I've developed a new type of RuboCop check that introduces the concept of "complexity density," leveraging the ABC metric to identify particularly complex lines in your Ruby code. 
This new cop, `Metrics/SingleLineComplexity`, can be viewed [here](https://github.com/rubocop/rubocop/pull/13595/files#diff-bac0afb83227700f28b5a130464cd6a6307fc7a8321aee0eab729a9dcae936c6),
 where it's under review as a pull request on the RuboCop Project.

In this post, I'll explain what complexity density is and how it can help you write cleaner, more maintainable code.

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

Assignments (A): Variable assignments or reassignments.

Branches (B): Control structures such as conditionals or loops.

Conditions (C): Boolean expressions and evaluations.

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

By introducing line-level complexity analysis with the ABC metric, this new RuboCop cop introduces a new tool to help us increase our codebases'
maintainability. 
 

Give it a try on your Ruby Project, and let me know what you think! If people like it, perhaps it could be ported to other languages as well.

Oh, and please give a Thumbs Up to the PR if you'd like to see it included in future versions of RuboCop 😊

