class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = player1;
    this.announcementHeader = document.getElementById("main-header");
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
    this.selectBoardSpace = this.selectBoardSpace.bind(this); // .bind(this) ensures that the definition of "this" inside selectBoardSpace will always refer to the instance of the Game object, as opposed to the element that the eventListener was installed on.
  }

  setUpGameBoard() {
    const container = document.getElementById("container");
    const gameBoard = document.createElement("main");
    gameBoard.classList.add("game-board");
    gameBoard.setAttribute("id", "game-board");

    for (let i = 0; i < 9; i++) {
      const boardSpace = document.createElement("div");
      boardSpace.classList.add("board-space");
      boardSpace.setAttribute("id", `_${i}`);
      gameBoard.appendChild(boardSpace);
    }
    container.append(gameBoard);
    return gameBoard;
  }

  startGame() {
    this.boardSpaces.forEach((boardSpace) => {
      boardSpace.addEventListener("click", this.selectBoardSpace);
    });
    this.announcePlayerTurn(this.currentPlayer);
  }

  announcePlayerTurn(currentPlayer) {
    this.announcementHeader.innerText = `${currentPlayer}'s turn!`;
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

  selectBoardSpace(e) {
    const selectedBoardSpace = e.target;
    this.selectedSpaces.push(selectedBoardSpace.getAttribute("id"));
    if (this.currentPlayer === this.player1) {
      selectedBoardSpace.classList.add("player1-selected-board-space");
      this.player1SelectedSpaces.push(selectedBoardSpace.getAttribute("id"));
      this.currentPlayer = this.player2;
    } else {
      selectedBoardSpace.classList.add("player2-selected-board-space");
      this.player2SelectedSpaces.push(selectedBoardSpace.getAttribute("id"));
      this.currentPlayer = this.player1;
    }
    selectedBoardSpace.removeEventListener("click", this.selectBoardSpace);
    this.winner = this.determineWinner();
    if (
      this.boardSpaces.length === this.selectedSpaces.length ||
      this.winner !== ""
    ) {
      this.gameOver();
    } else {
      this.announcePlayerTurn(this.currentPlayer);
    }
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
    let winner = "";
    winningPossibilities.forEach((possibility) => {
      const player1HasWon = possibility.every((value) => {
        return this.player1SelectedSpaces.includes(value);
      });
      const player2HasWon = possibility.every((value) => {
        return this.player2SelectedSpaces.includes(value);
      });
      if (player1HasWon) {
        winner = this.player1;
      } else if (player2HasWon) {
        winner = this.player2;
      }
    });
    return winner;
  }

  gameOver() {
    if (this.winner === "") {
      this.announcementHeader.innerText = "Draw! 🫱🏻‍🫲🏾";
    } else {
      this.announcementHeader.innerText = `${this.winner} Wins! 🏆`;
    }
    this.gameBoard.classList.add("game-over");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("container").append(createSetupMenu());

  const startGameButton = document.getElementById("launch-button");

  startGameButton.addEventListener("click", () => {
    const player1 = document.getElementById("player1-name").value;
    const player2 = document.getElementById("player2-name").value;
    const setupMenu = document.getElementById("setup-menu");
    setupMenu.classList.add("hide");
    const board = new Game(player1, player2);

    board.startGame();
  });
});

function createSetupMenu() {
  const setupMenu = document.createElement("form");
  setupMenu.setAttribute("id", "setup-menu");
  setupMenu.classList.add("setup-menu");

  const playerInputContainer = document.createElement("div");
  playerInputContainer.classList.add("player-select-container");

  const player1Input = document.createElement("input");
  player1Input.setAttribute("placeholder", "Player 1 Name");
  player1Input.setAttribute("id", "player1-name");
  player1Input.setAttribute("value", "Player 1");
  player1Input.classList.add("player-select-input");

  const player2Input = document.createElement("input");
  player2Input.setAttribute("placeholder", "Player 2 Name");
  player2Input.setAttribute("id", "player2-name");
  player2Input.setAttribute("value", "Player 2");
  player2Input.classList.add("player-select-input");

  playerInputContainer.append(player1Input, player2Input);

  const startGameButton = document.createElement("button");
  startGameButton.classList.add("start-game-button");
  startGameButton.setAttribute("type", "button");
  startGameButton.setAttribute("id", "launch-button");
  startGameButton.setAttribute("name", "launch-button");
  startGameButton.innerText = "Start Game!";
  setupMenu.append(playerInputContainer, startGameButton);

  return setupMenu;
}
