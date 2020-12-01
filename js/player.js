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
  { x: canvasWidth / 2 - 576 - 64, y: 334 },
  { x: canvasWidth / 2 + 64, y: 334 },
  { x: canvasWidth / 2 - 576 - 64, y: 720 },
  { x: canvasWidth / 2 + 64, y: 720 }
];

// playerBoardImage.addEventListener('load', () => {});

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.twoLines = 0;
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
