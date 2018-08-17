---
---

orz_quotes = [
  '*Happy campers* are the best. It is *happy*.',
  '*Happy* campers are best. It is good to *smell* you again...',
  'Inside is good. So much good that Orz will always *germinate*.',
  'Can you come together with Orz for *parties*?',
  'Other place is **Frumple**.',
  'Hello to our *house*. Do you feel *better* yet?'
]

$ ->
  random_quote = _.sample(orz_quotes)
  $(".project-tagline").html(random_quote);

