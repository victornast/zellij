const canvasGame = document.querySelector('canvas');

const canvasWidth = canvasGame.width;
const canvasHeight = canvasGame.height;

const ctx = canvasGame.getContext('2d');

//Game Instance

const playerNames = [
  document.getElementById('nameone'),
  document.getElementById('nametwo')
];
introText();
let game;
//Start game
const startTwoBtn = document.getElementById('create-new-game');
startTwoBtn.addEventListener('submit', (event) => {
  game = new Game(2);
  helpBtn.classList.add('active-btn');
  game.setFactoryTileCoordinates();
  game.loop();
  event.preventDefault();
});
