const helpOverlay = new Image();
helpOverlay.src = 'images/help-image.png';

const helpBtn = document.querySelector('.help');

let helpImage = false;

function drawHelp() {
  if (helpImage === true) {
    ctx.drawImage(helpOverlay, 15, 0);
  }
}

function introText() {
  //Intro text
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.font = '3rem "Carter One"';
  ctx.fillStyle = 'gainsboro';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(
    `Start a new game to tile a wall!`,
    canvasWidth / 2,
    canvasHeight / 4
  );
  ctx.fillText(
    `Take turns to pick tiles from factories`,
    canvasWidth / 2,
    canvasHeight / 4 + 150
  );
  ctx.fillText(
    `and fill your tracks to`,
    canvasWidth / 2,
    canvasHeight / 4 + 225
  );
  ctx.fillText(
    `transfer them on the wall!`,
    canvasWidth / 2,
    canvasHeight / 4 + 300
  );
}

helpBtn.addEventListener('click', () => {
  if (helpImage === false) {
    helpImage = true;
  } else {
    helpImage = false;
  }
});
