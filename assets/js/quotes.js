let orz_quotes = [
    '*Happy campers* are the best. It is *happy*.',
    '*Happy* campers are best. It is good to *smell* you again...',
    'Inside is good. So much good that Orz will always *germinate*.',
    'Can you come together with Orz for *parties*?',
    'Other place is **Frumple**.',
    'Hello to our *house*. Do you feel *better* yet?'
]

document.addEventListener("DOMContentLoaded", function(event) {
    let random_quote = orz_quotes[Math.floor(Math.random() * orz_quotes.length)];
    let tagline = document.getElementById("project-tagline")
    tagline.innerHTML = random_quote
    tagline.classList.remove('invisible')
    tagline.classList.remove('opacity-0')
});