
const stars = document.querySelectorAll(".star");
let rating = 0;

stars.forEach((star) => {
  star.addEventListener("mouseover", hoverStar);
  star.addEventListener("mouseout", resetStars);
  star.addEventListener("click", (event) => {
    rating = clickStar(event);
    resetStars();
  });
});

function hoverStar(event) {
  const hoveredStar = event.target;
  const hoveredRating = parseInt(hoveredStar.getAttribute("data-rating"));
  highlightStars(hoveredRating);
}

function resetStars() {
  highlightStars(rating);
}

function highlightStars(numStars) {
  stars.forEach((star, index) => {
    if (index < numStars) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

function clickStar(event) {
  return parseInt(event.target.getAttribute("data-rating"));
}

function returnCommento() {
  let commento = document.getElementById('comment').value;
  if (commento.length > 10) {
    return commento;
  } else {
    return null;
  }
}

document.querySelector('.more-info').addEventListener('click', () => {
  const commento = returnCommento();
  if (commento !== null && rating > 0) {
    sendFeedback(rating, commento);
  } else {
    alert("Please provide a valid rating and a comment (at least 10 characters) before submitting.");
  }
});

function sendFeedback(valutazione, commento) {
  alert("Invio del feedback con valutazione: " + valutazione + " e commento: " + commento);
}

// Inizializza le stelle vuote all'avvio
//resetStars();