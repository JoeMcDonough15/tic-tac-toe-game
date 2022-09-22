class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.container = document.getElementById("container");
    this.announcementHeader = document.getElementById("player-turn");
    this.gameBoard = this.setUpGameBoard();
    this.boardSpaces = Array.from(
      document.getElementsByClassName("board-space")
    );
    this.selectedSpaces = Array.from(
      document.getElementsByClassName("selected-board-space")
    );
    this.player1SelectedSpaces = [];
    this.player2SelectedSpaces = [];
    this.winner = "";
  }

  setUpGameBoard() {
    const gameBoard = document.createElement("main");
    gameBoard.classList.add("game-board");
    gameBoard.setAttribute("id", "game-board");

    for (let i = 0; i < 9; i++) {
      const boardSpace = document.createElement("div");
      boardSpace.classList.add("board-space");
      boardSpace.setAttribute("id", `_${i}`);
      gameBoard.appendChild(boardSpace);
    }
    this.container.append(gameBoard);
    return gameBoard;
  }

  announcePlayerTurn(currentPlayer) {
    this.announcementHeader.innerText = `It's ${currentPlayer}'s turn!`;
    this.boardSpaces.forEach((boardSpace) => {
      if (currentPlayer === this.player1) {
        boardSpace.classList.add("player1-turn");
        boardSpace.classList.remove("player2-turn");
      } else {
        boardSpace.classList.add("player2-turn");
        boardSpace.classList.remove("player1-turn");
      }
    });
  }

  determineWinner() {
    const winningPossibilities = [
      ["_0", "_1", "_2"],
      ["_3", "_4", "_5"],
      ["_6", "_7", "_8"],
      ["_0", "_3", "_6"],
      ["_1", "_4", "_7"],
      ["_2", "_5", "_8"],
      ["_0", "_4", "_8"],
      ["_2", "_4", "_6"],
    ];

    winningPossibilities.forEach((possibility) => {
      const player1HasWon = possibility.every((value) => {
        return this.player1SelectedSpaces.includes(value);
      });
      const player2HasWon = possibility.every((value) => {
        return this.player2SelectedSpaces.includes(value);
      });
      if (player1HasWon) {
        this.winner = this.player1;
        this.gameOver();
      } else if (player2HasWon) {
        this.winner = this.player2;
        this.gameOver();
      }
    });
  }

  gameOver() {
    console.log("winner is: ", this.winner);
    console.log("the gameBoard is: ", this.gameBoard);
    if (this.winner === "") {
      this.announcementHeader.innerText = "Draw!";
    } else {
      this.announcementHeader.innerText = `The winner is ${this.winner}! 🏆`;
    }
    this.gameBoard.classList.add("game-over");
    this.announcementHeader.classList.add("winner-text");
  }
}

this.container.append(createSetupMenu());

const startGameButton = document.getElementById("launch-button");

startGameButton.addEventListener("click", () => {
  const player1 = document.getElementById("player1-name").value;
  const player2 = document.getElementById("player2-name").value;
  const setupMenu = document.getElementById("setup-menu");
  setupMenu.classList.add("hide");
  const board = new Game(player1, player2);

  let currentPlayer = board.player1;
  board.boardSpaces.forEach((boardSpace) => {
    boardSpace.addEventListener("click", selectBoardSpace);
  });

  board.announcePlayerTurn(currentPlayer);

  // We want the game to last for as long as there is no winner and there are board spaces remaining.

  // Each player turn should last one click event.  As soon as a player selects a space, that space needs to be added to
  // board.selectedSpaces and to that player's selected spaces array

  // as each player clicks a square, the turn switches to the opposite player.

  function selectBoardSpace(e) {
    const selectedBoardSpace = e.target;
    selectedBoardSpace.classList.add("selected-space");
    board.selectedSpaces.push(selectedBoardSpace.getAttribute("id"));
    console.log("selected spaces: ", board.selectedSpaces);
    if (currentPlayer === board.player1) {
      console.log("player 1 selected a space.  It should turn blue.");
      selectedBoardSpace.classList.add("player1-selected-board-space");
      board.player1SelectedSpaces.push(selectedBoardSpace.getAttribute("id"));
      console.log(
        "places player 1 has selected: ",
        board.player1SelectedSpaces
      );
      currentPlayer = board.player2;
    } else {
      console.log("player 1 selected a space.  It should turn green.");
      selectedBoardSpace.classList.add("player2-selected-board-space");
      board.player2SelectedSpaces.push(selectedBoardSpace.getAttribute("id"));
      currentPlayer = board.player1;
    }
    selectedBoardSpace.removeEventListener("click", selectBoardSpace);

    // determining if we have a winner
    board.determineWinner();
    if (
      board.winner === "" &&
      board.boardSpaces.length === board.selectedSpaces.length
    ) {
      board.gameOver();
    } else if (board.winner === "") {
      board.announcePlayerTurn(currentPlayer);
    }
  }
});

function createSetupMenu() {
  const setupMenu = document.createElement("form");
  setupMenu.setAttribute("id", "setup-menu");
  setupMenu.classList.add("setup-menu");

  const setupHeader = document.createElement("h1");
  setupHeader.classList.add("setup-header");
  setupHeader.innerText = "Tic Tac Toe";

  const player1Input = document.createElement("input");
  player1Input.setAttribute("placeholder", "Player 1 Name");
  player1Input.setAttribute("id", "player1-name");

  const player2Input = document.createElement("input");
  player2Input.setAttribute("placeholder", "Player 2 Name");
  player2Input.setAttribute("id", "player2-name");

  const startGameButton = document.createElement("button");
  startGameButton.classList.add("start-game-button");
  startGameButton.setAttribute("type", "button");
  startGameButton.setAttribute("id", "launch-button");
  startGameButton.setAttribute("name", "launch-button");
  startGameButton.innerText = "Start Game!";
  setupMenu.append(setupHeader, player1Input, player2Input, startGameButton);
  return setupMenu;
}
