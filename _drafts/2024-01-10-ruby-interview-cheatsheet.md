---
layout: post
title: "Ruby Interview Cheatsheet"
tags: tech coding ruby
---


# Ruby Coding Interview Cheatsheet 

Describe what we'd like to do here.

Explain that this is a living document.

# String Manipulation

```ruby
# reverse a string
"hello".reverse
=> "olleh"
```

# array operations
    
```ruby
# reverse an array
[1,2,3].reverse
=> [3,2,1]

# sort an array
[3,2,1].sort
=> [1,2,3]
```

# sorting operations

## tries

```ruby
class TrieNode
  attr_accessor :children, :is_end_of_word

  def initialize()
    @children = {}
    @is_end_of_word = false
  end
end

class Trie

  def initialize()
    @root = TrieNode.new
  end

  def insert(word)
    curr_node = @root
    word.each_char do |char|
      curr_node.children[char] = TrieNode.new unless curr_node.children[char]
      curr_node = curr_node.children[char]
    end

    curr_node.is_end_of_word = true
  end

  def search(word)
    found_node = node_with_prefix(word)
    !found_node.nil? && found_node.is_end_of_word
  end

  def node_with_prefix(prefix)
    curr_node = @root
    prefix.each_char do |char|
      return nil unless curr_node.children[char]
      curr_node = curr_node.children[char]
    end

    curr_node
  end

  def starts_with(prefix)
    !node_with_prefix(prefix).nil?
  end

end
```

## tree traversals

## list slicing

## useful array methods

## char/ord

## string operations




# OLD REFERENCE STUFF


# CodinGame
Shout-Out to [CodinGame](https://www.codingame.com/)... it's perhaps the best place to practice coding puzzles, learn more about your favorite languages, and, optionally, learn some pretty cool game AI specific techniques. One of the greatest features they have is the ability to see other's solutions to a problem after you've completed yours, complete with full comments from other users and rankings for the best solutions per-language to each challenge. This is a great way to discover new language features or algorithmic approaches you may not be familiar with. You can also [follow me](https://www.codingame.com/profile/4b1d61768cee9c0433fa188b757ef9535296954
) there!

While exploring some coding puzzles there I found a couple neat tricks for comparing adjacent elements in Ruby that I'd like to share. 

# The Problem

The challenge (simplified here) is fairly straight-forward:

**Given a list of integers, identify the two closest integers and output their difference.**

Assuming we have the list of digits sorted already in an array called **nums**

```ruby
nums = 10.times.map { rand(100) }.sort
=> [55, 59, 65, 70, 75, 79, 84, 87, 89, 94]
```

a straight-forward solution in Ruby might be to loop through the list, calcuate the difference between adjacent digits, and remember the smallest difference.

```ruby
min_distance = (nums[1] - nums[0])
for i in (2...nums.length)
    distance = (nums[i] - nums[i-1])
    if distance < min_distance
        min_distance = distance
    end
end
```

After reviewing the top-ranked solutions on CodinGame however, I discovered 2 new Ruby solutions that are much more elegant. One using the [each_cons](https://ruby-doc.org/3.2.1/Enumerable.html#method-i-each_cons) method, the other using a combination of [zip](https://ruby-doc.org/3.2.1/Enumerable.html#method-i-zip) and [rotate](https://ruby-doc.org/3.2.1/Array.html#method-i-rotate).

# each_cons approach

**each_cons** groups n consective elements together:

```ruby
nums
=> [55, 59, 65, 70, 75, 79, 84, 87, 89, 94]
nums.each_cons(2).to_a
=> [[55, 59], [59, 65], [65, 70], [70, 75], [75, 79], [79, 84], [84, 87], [87, 89], [89, 94]]
```
From here, you could simply map the elements in main array to their differences and then take the min: 
```ruby
diffs = nums.each_cons(2).map { |n1, n2| n2 - n1 }
=> [4, 6, 5, 5, 4, 5, 3, 2, 5]
diffs.min
=> 2
```
or in a nice one-liner:
```ruby
nums.each_cons(2).map { |n1, n2| n2 - n1 }.min
```

# zip and rotate approach
**rotate** ... rotates the array, by n elements:
```ruby
nums
=> [55, 59, 65, 70, 75, 79, 84, 87, 89, 94]
nums.rotate(1)
=> [59, 65, 70, 75, 79, 84, 87, 89, 94, 55]
nums.rotate(3)
=> [70, 75, 79, 84, 87, 89, 94, 55, 59, 65]
```

**zip** sort of 'zips up' or merges N arrays together to create a new array with elements of length N. In our case,
we can zip the rotated array together with the original:
```ruby
nums
=> [55, 59, 65, 70, 75, 79, 84, 87, 89, 94]
nums.rotate(1)
=> [59, 65, 70, 75, 79, 84, 87, 89, 94, 55]
nums.zip(nums.rotate(1))
=> [[55, 59], [59, 65], [65, 70], [70, 75], [75, 79], [79, 84], [84, 87], [87, 89], [89, 94], [94, 55]]
```
Now we can simply map this array to the differences of its elements and take the min:
```ruby
diffs = nums.zip(nums.rotate).map{|n1 , n2| (n2 - n1).abs}
=> [4, 6, 5, 5, 4, 5, 3, 2, 5, 39]
diffs.min
=> 2
```
One strange thing with the rotate and zip approach is that you end up comparing the largest and smallest elements (giving us 39 in this particular case). It doesn't matter here as the difference between the largest and smallest elements in the array will always be larger than the minimum which we're looking for, and can be discarded safely. Still; a bit of a strange artifact of this solution if you ask me!

# Conclusion

Comparing adjacent elements is a common-enough problem in programming that these tools feel like really useful additions to my toolbox. I'd definitely prefer the `each_cons` solution over the `zip` and `rotate` solution, though `zip` and `rotate` are surely useful tools for the right application. I'd seen `zip` and `rotate` before but never really played with them, and `each_cons` was totally new to me. I can't wait to learn even more exploring the challenges on [CodinGame](https://www.codingame.com/)!.

