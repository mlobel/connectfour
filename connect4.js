// creates class "Game" which will hold the majority of our code.
// Declares and stores important information for the rest of the code, calls the methods defined later in the object and sets the height and width as part of the object.

class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.players = [p1, p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();

    // Sets value for gameover to false so the game will run.
    this.gameOver = false;
  }

  // Changed the makeBoard function into a method and changed the code inside to call different stored information using the "this" keyword.

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  // did the same with the makeHtmlBoard function, turned it into a method, sets inner HTML to empty
  makeHtmlBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";

    // sets the id for the created tr element to "column-top"
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    // Creates event handler that handles gameclicks of the column top tr element using the "this" keyword.

    this.handleGameClick = this.handleClick.bind(this);

    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  // Displays an alert message when the game is over, and removes event listener.

  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
  }

  // Handles click event for placing a piece, checks what column is clicked and stores the value and returns nothing if column is full (invalid move)

  handleClick(evt) {
    const x = +evt.target.id;

    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // places current players color token in next available spot in column.

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // Checks that each cell is filled, and if it is returns string "TIE!"

    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("TIE!");
    }

    // checks that the game is over, using the checkForWin method, and returns string "The (player color) player won!" inside the endGame method

    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame("The ${this.currPlayer.color} player won!");
    }

    // Checks to see if current player is 0 is true, and if it is switches to player [1], if returns false switches to player [0]

    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  // Checks for win condition by checking for a horizontal, vertical, diagonal right and diagonal left row of 4.
  checkForWin() {
    const _win = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // Checks to see if any of the win conditions are met and then returns boolean true if they are

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

// creates a class for the player token, and sets the color.

class Player {
  constructor(color) {
    this.color = color;
  }
}

// Gets start-game element from the html document, and adds an event listener for a click on the start game element. Also takes the player color input and stores them at time of click to be used in previous class

document.getElementById("start-game").addEventListener("click", () => {
  let p1 = new Player(document.getElementById("p1-color").value);
  let p2 = new Player(document.getElementById("p2-color").value);
  new Game(p1, p2);
});
