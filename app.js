const raindropSize = 50;
const animationSpeed = 7;
let difficulty = 1;
let errorNumber = 0;
const startBtn = document.querySelector('#start');
const gameArea = document.querySelector('#game-area');
const rainArea = document.querySelector('#rain-area');
const wave = document.querySelector('#wave');
const input = document.querySelector('#input');
const levelUpMsg = document.querySelector('.level-up');
let raindrops = [];
let timers = [];
let audioMusic = document.querySelector('.audio-music');
const gameCountNumber = document.querySelector('.game-count-number')

const gameOver = document.querySelector('.game-over');
let bonusCount = 0;

startBtn.addEventListener('click', startGame);
input.addEventListener('keydown', userInputHandle);


let count = document.querySelector(".count-number");
function userInputHandle(event) {
  if (event.code === 'Enter') {
    const guess = event.target.value;
    event.target.value = '';
    raindrops.forEach((raindrop) => {
      if (raindrop.dataset.result === guess) {
        raindrop.remove();
        bonusCount += 1;
        count.textContent = +count.textContent + 10 + bonusCount;
        audioPlay('right');
      }
    });
  }
}

const intersectObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio !== 1) {
        entry.target.remove();
        errorNumber++;
        if (errorNumber === 3) {
          endGame();
        }
        raiseWaves();
      }
    }),
  {
    root: rainArea,
    threshold: [ 0.1, 1 ],
  },
);

function startGame() {
    count.textContent = 0;
  startBtn.classList.toggle('invisible');
    timers.push(setInterval(createRaindrop, 2000), setInterval(increaseDifficulty, 5000));
    gameOver.style.display = 'none';
  raiseWaves();
}

function increaseDifficulty() {
  difficulty = difficulty + 0.1;
  levelUpMsg.classList.toggle('invisible');
  setTimeout(() => {
    levelUpMsg.classList.toggle('invisible');
  }, 1000);
}

function createRaindrop() {
  const [ problem, result ] = getRandomProblem();
  const raindrop = document.createElement('div');
  raindrop.classList.add('raindrop');
  raindrop.innerHTML = problem;
  raindrop.dataset.result = result;
  raindrop.style.left = getRaindropPosition();
  raindrop.style.animation = `${animationSpeed / difficulty}s linear forwards raindrop_fall`;
  rainArea.appendChild(raindrop);
  raindrops.push(raindrop);
  intersectObserver.observe(raindrop);
}

function getRaindropPosition() {
  gameAreaWidth = +getComputedStyle(gameArea).width.slice(0, -2);
  return `${Math.abs(Math.floor(gameAreaWidth * Math.random()) - raindropSize)}px`;
}

function getRandomProblem() {
  const operator = getRandomOperator();
  let firstNumber = getRandomNumber();
  let secondNumber = getRandomNumber();
  let result;

  switch (operator) {
    case '+': {
      result = firstNumber + secondNumber;
      break;
    }
    case '*': {
      firstNumber = Math.ceil(firstNumber / 2);
      secondNumber = Math.ceil(secondNumber / 2);
      result = firstNumber * secondNumber;
      break;
    }
    case '-': {
      result = Math.max(firstNumber, secondNumber);
      secondNumber = Math.min(firstNumber, secondNumber);
      firstNumber = result + secondNumber;
      break;
    }
    case '/': {
      firstNumber = Math.ceil(firstNumber / 2);
      secondNumber = Math.ceil(secondNumber / 2);
      result = Math.max(firstNumber, secondNumber);
      secondNumber = Math.min(firstNumber, secondNumber);
      firstNumber = result * secondNumber;
      break;
    }
  }
  return [ `${firstNumber} ${operator} ${secondNumber}`, result ];
}

function getRandomNumber() {
  return Math.ceil(Math.random() * (difficulty * 10));
}

function getRandomOperator() {
  const operators = [ '+', '-', '*', '/' ];
  const randomOperatorIndex = Math.floor(Math.random() * operators.length);
  return operators[randomOperatorIndex];
}

function raiseWaves() {
  const waves = document.querySelector('.wave-wrapper');
  const delta = errorNumber * 100;
  waves.style.bottom = `${delta}px`;
  wave.style.height = `${60 + delta}px`;
}

function endGame() {
  timers.forEach(clearInterval);
  raindrops.forEach((raindrop) => raindrop.remove());
  timer = [];
  raindrops = [];
  errorNumber = 0;
  bonusCount = 0;
  startBtn.classList.toggle('invisible');
    audioPlay('lose');
    gameOver.style.display = 'block';
    gameCountNumber.textContent = count.textContent;
}

function audioPlay(loseGame) {
  console.log(loseGame);
  if (loseGame === 'lose') {
    audioMusic.src = 'audio/lose.mp3';
  } else if (loseGame === 'error') {
    audioMusic.src = 'audio/error.mp3';
  } else {
    audioMusic.src = 'audio/right.mp3';
  }

  audioMusic.play();
}
