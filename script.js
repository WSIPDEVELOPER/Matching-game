const icons = ['🍎', '🍉', '🍌', '🍇'];
const cards = [];
let selectedCards = [];
let attempts = 0;
let pairsMatched = 0;
let gameOver = false;

const gameBoard = document.getElementById('gameBoard');
const attemptsDisplay = document.getElementById('attempts');

function initializeGame() {
  generateCards();
  renderCards();
}

function generateCards() {
  cards.length = 0;
  icons.forEach(icon => {
    for (let i = 0; i < 2; i++) {
      cards.push({ icon: icon, matched: false, flipped: false });
    }
  });
  shuffle(cards);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderCards() {
  gameBoard.innerHTML = '';
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('col-sm-3', 'card');
    cardElement.dataset.index = index;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner', card.flipped ? 'flip' : 'unflip');
    cardInner.dataset.index = index;
    cardInner.addEventListener('click', () => selectCard(index));

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.innerText = '?';

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.innerText = card.icon;

    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    cardElement.appendChild(cardInner);
    gameBoard.appendChild(cardElement);
  });
}

function selectCard(index) {
  if (!cards[index].flipped && selectedCards.length < 2 && !gameOver) {
    const cardElement = document.querySelector(`.card-inner[data-index="${index}"]`);
    cardElement.classList.remove('unflip');
    cardElement.classList.add('flip');
    cards[index].flipped = true;
    selectedCards.push(index);

    if (selectedCards.length === 2) {
      setTimeout(checkMatch, 1000);
      attempts++;
      updateAttemptsDisplay();
    }
  }
}

function checkMatch() {
  const [index1, index2] = selectedCards;
  const card1 = cards[index1];
  const card2 = cards[index2];

  if (card1.icon === card2.icon) {
    card1.matched = true;
    card2.matched = true;
    pairsMatched++;
    if (pairsMatched === icons.length) {
      alert(`Congratulations! You won in ${attempts} attempts.Do in less moves next time`);
      restartGame();
    }
  } else {
    const cardElement1 = document.querySelector(`.card-inner[data-index="${index1}"]`);
    const cardElement2 = document.querySelector(`.card-inner[data-index="${index2}"]`);
    cardElement1.classList.remove('flip');
    cardElement2.classList.remove('flip');
    cardElement1.classList.add('unflip');
    cardElement2.classList.add('unflip');
    cards[index1].flipped = false;
    cards[index2].flipped = false;
  }

  selectedCards = [];
  if (attempts >= 6 && pairsMatched < icons.length) {
    alert('Game Over! You got maximum attems.Better luck next time');
    restartGame();
  }
}

function updateAttemptsDisplay() {
  attemptsDisplay.innerText = attempts;
}

function restartGame() {
  attempts = 0;
  pairsMatched = 0;
  gameOver = false;
  selectedCards = [];
  cards.forEach(card => {
    card.flipped = false;
    card.matched = false;
  });
  renderCards();
  updateAttemptsDisplay();
}

initializeGame();
