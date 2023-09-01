const unitLength = 20;
let canvas;
let penColor = penColorInput.value;
let speed = +speedInput.value;
let Loneliness = +LonelinessInput.value;
let Overpopulation = +OverpopulationInput.value;
let Reproduction = +ReproductionInput.value;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let board; // 把let currentBoard; let nextBoard;變object
let playing = true;
let keyboardMode = {
  currentX: 0,
  currentY: 0,
};

function changePenColor(event) {
  penColor = event.target.value;
}

function changeSpeed(event) {
  speed = +event.target.value;
}

function changeLoneliness(event) {
  Loneliness = +event.target.value;
  const LonelinessValue = event.target.value;
  document.querySelector(
    "#LonelinessValue"
  ).textContent = `Value: ${LonelinessValue}`;
}

document
  .querySelector("#LonelinessDefault")
  .addEventListener("click", function (event) {
    document.querySelector("#LonelinessInput").value = 2;
    changeLoneliness({ target: document.querySelector("#LonelinessInput") }); // Update displayed value
  });

function changeOverpopulation(event) {
  Overpopulation = +event.target.value;
  const OverpopulationValue = event.target.value;
  document.querySelector(
    "#OverpopulationValue"
  ).textContent = `Value: ${OverpopulationValue}`;
}

document
  .querySelector("#OverpopulationDefault")
  .addEventListener("click", function (event) {
    document.querySelector("#OverpopulationInput").value = 3;
    changeOverpopulation({
      target: document.querySelector("#OverpopulationInput"),
    }); // Update displayed value
  });

function changeReproduction(event) {
  Reproduction = +event.target.value;
  const ReproductionValue = event.target.value;
  document.querySelector(
    "#ReproductionValue"
  ).textContent = `Value: ${ReproductionValue}`;
}

document
  .querySelector("#ReproductionDefault")
  .addEventListener("click", function (event) {
    document.querySelector("#ReproductionInput").value = 3;
    changeReproduction({
      target: document.querySelector("#ReproductionInput"),
    }); // Update displayed value
  });

document
  .querySelector("#stopandplay")
  .addEventListener("click", function (event) {
    if (playing) {
      noLoop();
      playing = false;
    } else {
      loop();
      playing = true;
    }
  });

function preload() {
  backgroundImage = loadImage("/pic/GameofLife/cool.jpg"); // Load your GIF image
}

function setup() {
  /* Set the canvas to be under the element #canvas*/
  canvas = createCanvas(windowWidth, windowHeight - 100);
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);
  backgroundImage.resize(width, height);

  keyboardMode = {
    currentX: floor(columns / 2),
    currentY: floor(rows / 2),
  };

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  board = [];
  for (let i = 0; i < columns; i++) {
    board[i] = []; //board =[[],[],[],[],[]]
  }

  // Now both currentBoard and nextBoard are array of array of undefined values.
  init(); // Set the initial values of the currentBoard and nextBoard
}

console.log(columns);

/**
 * Initialize/reset the board state
 */
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      //currentBoard[i][j] = 0;
      // let someVariables = <condictions> : <when_true> : <when_false>;
      //currentBoard[i][j] = random() > 0.8 ? 1 : 0; // one line if
      //nextBoard[i][j] = 0;
      board[i][j] = {
        isAlive: false,
        nextIsAlive: false,
        boxColor: penColor,
        random: random(),
      };

      document
        .querySelector("#randomplay")
        .addEventListener("click", function (event) {
          if (board[i][j].random > 0.8) {
            board[i][j].isAlive = true;
          } else {
            board[i][j].isAlive = false;
          }
        });
    }
  }
}

function draw() {
  background(backgroundImage);
  //if key pressed , generawte() = false ,
  //selection_cell = board[15][15];
  //selection_cell.isAlive = true;
  //fill(selection_cell.boxColor);
  frameRate(speed);

  generate();
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let cell = board[x][y];

      if (cell.isAlive) {
        fill(cell.boxColor);
      } else {
        //let bgcolor = calcBgColor(x, y);
        fill(cell.boxColor + "55");
      }
      strokeWeight(1);

      stroke(strokeColor);
      rect(x * unitLength, y * unitLength, unitLength, unitLength);
    }
    //let selection_cell = board[columns / 2][rows / 2]; ///remember let
    //selection_cell.isAlive = true;
    //fill(selection_cell.boxColor);
  }
}

function generate() {
  // if enter is pressed generate return false.. <--
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighborCells = [];
      for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
          if (dx == 0 && dy == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge

          // **changing name of neighboors(x,y) to dx , dy**
          let peerX = (x + dx + columns) % columns;
          let peerY = (y + dy + rows) % rows;
          let peerCell = board[peerX][peerY];
          if (peerCell.isAlive) {
            neighborCells.push(peerCell);
          }
        }
      }

      let neighbors = neighborCells.length;

      let cell = board[x][y];
      // Rules of Life
      if (cell.isAlive && neighbors < Loneliness) {
        // Die of Loneliness
        cell.nextIsAlive = false;
      } else if (cell.isAlive && neighbors > Overpopulation) {
        // Die of Overpopulation
        cell.nextIsAlive = false;
        1;
      } else if (!cell.isAlive && neighbors == Reproduction) {
        // New life due to Reproduction
        cell.nextIsAlive = true;
        cell.boxColor = pickChildColor(neighborCells);
      } else {
        // Stasis
        cell.nextIsAlive = cell.isAlive;
      }
    }
  }

  // Swap the nextBoard to be the current Board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let cell = board[x][y];
      cell.isAlive = cell.nextIsAlive;
    }
  }
}

function pickChildColor(cells) {
  let r = 0;
  let g = 0;
  let b = 0;
  for (let cell of cells) {
    r += parseInt(cell.boxColor.slice(1, 3), 16);
    g += parseInt(cell.boxColor.slice(3, 5), 16);
    b += parseInt(cell.boxColor.slice(5, 7), 16);
  }
  r = Math.round(r / cells.length).toString(16);
  g = Math.round(g / cells.length).toString(16);
  b = Math.round(b / cells.length).toString(16);
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  r.toString(16);
  return "#" + r + g + b;
}

function isMouseWithinCanvas() {
  return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
}
/**
 * When mouse is dragged
 */
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */

  if (isMouseWithinCanvas()) {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
      return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    let cell = board[x][y];
    cell.isAlive = true;
    cell.boxColor = penColor;
    fill(penColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
  }
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  if (isMouseWithinCanvas()) {
    noLoop();
    mouseDragged();
    cursor();
  }
}

function mouseMoved() {
  cursor();
}

/**
 * When mouse is released
 */
function mouseReleased() {
  if (isMouseWithinCanvas()) {
    loop();
    playing = true;
  }
}

//let keyboardMode = {
// currentX: columns / 2,
//  currentY: rows / 2,
//};

function keyPressed() {
  window.onkeydown = function (e) {
    return e.keyCode !== 32;
  };
  // Store the previous cell's position
  let previous_cell = {
    x: keyboardMode.currentX,
    y: keyboardMode.currentY,
  };

  if (keyCode === ENTER) {
    if (playing) {
      noLoop();
    } else {
      strokeWeight(1);
      loop();
    }
    playing = !playing; // Toggle the playing state
  }

  if (!playing) {
    if (keyCode === 87) {
      keyboardMode.currentY = keyboardMode.currentY - 1;
    } else if (keyCode === 83) {
      keyboardMode.currentY = keyboardMode.currentY + 1;
    } else if (keyCode === 68) {
      keyboardMode.currentX = keyboardMode.currentX + 1;
    } else if (keyCode === 65) {
      keyboardMode.currentX = keyboardMode.currentX - 1;
    }
    strokeWeight(1);

    stroke(strokeColor);
    // Clear the previous cell's content

    fill(0, 0, 0, 0);
    rect(
      previous_cell.x * unitLength,
      previous_cell.y * unitLength,
      unitLength,
      unitLength
    );
    // Draw the current cell in red
    strokeWeight(1);
    stroke("rgb(255,0,0)");
    fill(0, 0, 0, 0);
    rect(
      keyboardMode.currentX * unitLength,
      keyboardMode.currentY * unitLength,
      unitLength,
      unitLength
    );

    if (keyCode === 32) {
      let cell = board[keyboardMode.currentX][keyboardMode.currentY];
      cell.isAlive = true;
      cell.boxColor = penColor;
      fill(penColor);
      stroke(strokeColor);
      rect(
        keyboardMode.currentX * unitLength,
        keyboardMode.currentY * unitLength,
        unitLength,
        unitLength
      );
    }
  }
  // Reset the stroke and fill to their original values
}

///document.querySelector("#reset-game").addEventListener("click", function () {
///  init();
//});
