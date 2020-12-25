class Track {
  constructor(size) {
    this.maxSlots = size;
    this.usedSlots = 0;
    this.tileID = 0;
    this.available = false;
  }
}

const playerBoardImage = new Image();
playerBoardImage.src = 'images/player-board.png';

const playerDrawCoord = [
  { x: canvasWidth / 2 - 576 - 12, y: 334 },
  { x: canvasWidth / 2 + 12, y: 334 },
  { x: canvasWidth / 2 - 576 - 12, y: 720 },
  { x: canvasWidth / 2 + 12, y: 720 }
];

class Player {
  constructor(name, id) {
    this.name = name;
    this.playerImage = new Image();
    this.playerImage.src = 'images/Chara_Idle.png';
    this.speechBubble = new Image();
    this.speechBubble.src = 'images/speech-bubble.png';
    this.spriteChangeTime = 0;
    this.spritePosition = 0;
    this.score = 0;
    this.scoreRounds = [];
    this.penaltyRounds = [];
    this.lowerEndside = 0;
    this.midEndside = 0;
    this.upperEndside = 0;
    this.storage = [];
    for (let i = 0; i < 5; i++) {
      this.storage.push(new Track(i + 1));
    }
    this.penaltyLine = [];
    this.penaltyValues = [1, 1, 2, 2, 2, 3, 3, 3, 3];
    this.wallIDs = [
      [1, 2, 3, 4, 5],
      [5, 1, 2, 3, 4],
      [4, 5, 1, 2, 3],
      [3, 4, 5, 1, 2],
      [2, 3, 4, 5, 1]
    ];
    this.wallFill = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];
  }

  drawPenaltyLine() {
    for (let i = 0; i < this.penaltyLine.length; i++) {
      ctx.drawImage(
        tileImage,
        this.penaltyLine[i] * 50,
        0,
        50,
        50,
        4 + (50 + 8) * i,
        (8 + 50) * 5 + 12,
        50,
        50
      );
    }
  }

  drawWorkers() {
    for (let track = 0; track < 5; track++) {
      for (let tile = 0; tile < this.storage[track].usedSlots; tile++) {
        ctx.drawImage(
          tileImage,
          this.storage[track].tileID * 50,
          0,
          50,
          50,
          290 + 4 + tile * (50 + 8),
          4 + track * (50 + 8),
          50,
          50
        );
      }
    }
  }

  drawWall() {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (this.wallFill[row][col] === 1) {
          ctx.drawImage(
            tileImage,
            this.wallIDs[row][col] * 50,
            0,
            50,
            50,
            4 + col * (50 + 8),
            4 + row * (50 + 8),
            50,
            50
          );
        }
      }
    }
  }

  draw() {
    ctx.font = '1.5rem "Carter One"';
    ctx.fillStyle = 'gainsboro';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'start';
    ctx.fillText(`${this.name}: ${this.score} points`, 4, -24);
    ctx.drawImage(playerBoardImage, 0, 0);
    this.drawPenaltyLine();
    this.drawWorkers();
    this.drawWall();
  }

  drawAvailableTrack(color) {
    this.checkAvailableTrack(color);
    for (let i = 0; i < 5; i++) {
      if (this.storage[i].available) {
        ctx.fillStyle = 'green';
        ctx.fillRect(290, i * (50 + 8), (i + 1) * (50 + 8), 50 + 8);
      }
    }
    if (color > 0) {
      ctx.fillStyle = 'orange';
      ctx.fillRect(0, 298, 406, 58);
    }
  }

  drawAsActive() {
    const spriteSize = this.playerImage.height / 4;
    if (Date.now() > this.spriteChangeTime + 100) {
      this.spritePosition = (this.spritePosition + 1) % 16;
      this.spriteChangeTime = Date.now();
    }
    ctx.font = '1rem "Carter One"';
    ctx.fillStyle = 'gainsboro';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.drawImage(
      this.playerImage,
      spriteSize * (this.spritePosition % 4),
      spriteSize * ((this.spritePosition / 4) | 0),
      spriteSize,
      spriteSize,
      playerBoardImage.width - spriteSize / 2.5,
      -100,
      spriteSize * 0.5,
      spriteSize * 0.5
    );
    ctx.drawImage(
      this.speechBubble,
      0,
      0,
      104,
      104,
      playerBoardImage.width - spriteSize / 6.5,
      -50,
      72,
      72
    );
    ctx.fillText(`Your`, playerBoardImage.width - 44, -28);
    ctx.fillText(`turn!`, playerBoardImage.width - 44, -14);
  }

  drawScore() {
    ctx.font = '1rem "Carter One"';
    ctx.fillStyle = 'gainsboro';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'start';
    ctx.fillText(`${this.name}: ${this.score} points`, 0, 0);
    ctx.fillRect(0, 5, 100, 2);
    for (let round = 0; round < this.scoreRounds.length; round++) {
      if (
        this.penaltyRounds[round] === 0 ||
        this.penaltyRounds[round] === undefined
      ) {
        ctx.fillText(
          `Round ${round + 1}: ${this.scoreRounds[round]}`,
          0,
          35 + round * 22
        );
      } else {
        ctx.fillText(
          `Round ${round + 1}: ${this.scoreRounds[round]} (${
            this.penaltyRounds[round]
          } pen)`,
          0,
          35 + round * 22
        );
      }
    }
  }

  checkAvailableTrack(color) {
    for (let i = 0; i < 5; i++) {
      if (
        this.storage[i].usedSlots < this.storage[i].maxSlots &&
        (this.storage[i].tileID === 0 || this.storage[i].tileID === color) &&
        this.wallFill[i][this.wallIDs[i].indexOf(color)] === 0
      ) {
        this.storage[i].available = true;
      } else {
        this.storage[i].available = false;
      }
    }
  }
}
