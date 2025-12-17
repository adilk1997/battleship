// /* Game initialization:
// - create two 8x8 boards
// - allow both players to place their ships; the game cannot start until all ships are placed
// - set the starting player (always Player 1)
// - set the game state to "in progress"
// - display "Player 1's turn" on the screen

// Game state:
// - maintain two arrays storing the positions of the ships for each player
// - track whether the game is in progress or finished
// - if the game is finished, determine and display the winner

// Click handling during the game:
// - determine which cell was clicked
// - if the cell contains a ship, register a hit; otherwise register a miss
// - if a ship is hit, mark the cell as "hit"
// - prevent clicking the same cell more than once
// - visually mark clicked cells (hit or miss)
// - after processing hit or miss, switch to the other player's turn

// End of the game:
// - when a player has no remaining ship cells, end the game
// - declare the winner
// - prevent any further moves

// Reset:
// - clicking the reset button restarts the game
// - clear the boards and allow ships to be placed again
// - reset the turn to Player 1
// */


/*-------------------------------- Constants --------------------------------*/
const boardSize = 8;

/*---------------------------- Variables (state) ----------------------------*/
let currentPlayer;
let positionBoatPlayer1;
let positionBoatPlayer2;
let shipsToPlacePlayer1;
let shipsToPlacePlayer2;
let phase;

/*------------------------ Cached Element References ------------------------*/
const player1BoardEl = document.querySelector('#player1-board');
const player2BoardEl = document.querySelector('#player2-board');
const resetBtnEl = document.querySelector('#reset');
const messageEl = document.querySelector('#message');

/*-------------------------------- Functions --------------------------------*/
const buildGrid = (boardEl) => {
  boardEl.innerHTML = '';

  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    boardEl.appendChild(cell);
  }
};

const init = () => {
  buildGrid(player1BoardEl);
  buildGrid(player2BoardEl);

  player1BoardEl.classList.remove('hide-ships');
  player2BoardEl.classList.remove('hide-ships');

  currentPlayer = 'player1';
  phase = 'setup';
  positionBoatPlayer1 = [];
  positionBoatPlayer2 = [];
  shipsToPlacePlayer1 = 9;
  shipsToPlacePlayer2 = 9;

  messageEl.textContent = "Player 1: place 9 ship cells";
};

const checkWinner = () => {
  if (positionBoatPlayer1.length === 0) {
    messageEl.textContent = "PLAYER 2 WINS! 🎉";
    phase = 'gameover';
  } else if (positionBoatPlayer2.length === 0) {
    messageEl.textContent = "PLAYER 1 WINS! 🎉";
    phase = 'gameover';
  }
};

/*----------------------------- Event Listeners -----------------------------*/
player1BoardEl.addEventListener('click', (evt) => {
  if (phase !== 'setup') return;
  if (currentPlayer !== 'player1') return;
  if (!evt.target.classList.contains('cell')) return;

  const index = Number(evt.target.dataset.index);
  if (positionBoatPlayer1.includes(index)) return;

  if (shipsToPlacePlayer1 === 9) {
    evt.target.classList.add('ship-1');
  } else if (shipsToPlacePlayer1 <= 8 && shipsToPlacePlayer1 >= 6) {
    evt.target.classList.add('ship-3');
  } else {
    evt.target.classList.add('ship-5');
  }
  positionBoatPlayer1.push(index);

  shipsToPlacePlayer1--;
  messageEl.textContent = `Player 1 placing ships: ${shipsToPlacePlayer1} remaining`;

  if (shipsToPlacePlayer1 === 0) {
    currentPlayer = 'player2';
    messageEl.textContent = "Player 2: place 9 ship cells (1 + 3 + 5)";
  }
});

player2BoardEl.addEventListener('click', (evt) => {
  if (phase !== 'setup') return;
  if (currentPlayer !== 'player2') return; //se non è il turno di player 2 ignora il click
  if (!evt.target.classList.contains('cell')) return; //se non ho cliccato una cella ignora

  const index = Number(evt.target.dataset.index);
  if (positionBoatPlayer2.includes(index)) return;

  if (shipsToPlacePlayer2 === 9) {
    evt.target.classList.add('ship-1');
  } else if (shipsToPlacePlayer2 <= 8 && shipsToPlacePlayer2 >= 6) {
    evt.target.classList.add('ship-3');
  } else {
    evt.target.classList.add('ship-5');
  }

  positionBoatPlayer2.push(index);

  shipsToPlacePlayer2--;
  messageEl.textContent = `Player 2 placing ships: ${shipsToPlacePlayer2} remaining`;

  if (shipsToPlacePlayer2 === 0) {
    phase = 'battle';
    currentPlayer = 'player1';
    player2BoardEl.classList.add('hide-ships');
    messageEl.textContent = "Battle phase: Player 1 shoot";
    //evita che parte anche il listener di battle sullo stesso click
    evt.stopImmediatePropagation(); // stopImmediatePropagation w3school https://www.w3schools.com/jsref/event_stopimmediatepropagation.asp

  }
});

// BATTLE PHASE: Player 1 shoots on Player 2 board
player2BoardEl.addEventListener('click', (evt) => {
  if (phase !== 'battle') return;
  if (currentPlayer !== 'player1') return;
  if (!evt.target.classList.contains('cell')) return;

  const index = Number(evt.target.dataset.index);

  if (
    evt.target.classList.contains('hit') ||
    evt.target.classList.contains('miss')
  ) return;

  if (positionBoatPlayer2.includes(index)) {
    evt.target.classList.add('hit');
    positionBoatPlayer2 = positionBoatPlayer2.filter(i => i !== index);
    messageEl.textContent = "HIT! Player 2's turn";
  } else {
    evt.target.classList.add('miss');
    messageEl.textContent = "MISS! Player 2's turn";
  }

  checkWinner();
  if (phase === 'gameover') return;

  currentPlayer = 'player2';

  player1BoardEl.classList.add('hide-ships');    // nasconde le navi di Player 1 (per Player 2)
  player2BoardEl.classList.remove('hide-ships'); // mostra di nuovo la board di Player 2 (così Player 2 vede dove ha sparato)
});


// BATTLE PHASE: Player 2 shoots on Player 1 board
player1BoardEl.addEventListener('click', (evt) => {
  if (phase !== 'battle') return;
  if (currentPlayer !== 'player2') return;
  if (!evt.target.classList.contains('cell')) return;

  const index = Number(evt.target.dataset.index);

  // evita doppio click sulla stessa cella
  if (evt.target.classList.contains('hit') || evt.target.classList.contains('miss')) return;

  if (positionBoatPlayer1.includes(index)) {
    evt.target.classList.add('hit');
    positionBoatPlayer1 = positionBoatPlayer1.filter(i => i !== index); //riassegna a positionBoatPlayer1 praticametne solo i numeri diversi da index
    messageEl.textContent = "HIT! Player 1's turn";
  } else {
    evt.target.classList.add('miss');
    messageEl.textContent = "MISS! Player 1's turn";
  }

  checkWinner();
  if (phase === 'gameover') return;

  currentPlayer = 'player1';

  // torna il turno a Player 1: nascondi P2 e mostra P1
  player2BoardEl.classList.add('hide-ships');
  player1BoardEl.classList.remove('hide-ships');
});


resetBtnEl.addEventListener('click', init); //reset ovviamente

/*---------------------------------- Init -----------------------------------*/
init();
