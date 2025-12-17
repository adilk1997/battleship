// /* inizializzazione del gioco:
// -devo creare due board di 8x8
// -devo far piazzare le navi a entrambi i giocatori, se non sono piazzate tutte le navi il gioco non parte
// -impostare il giocatore che comincia il gioco (sempre il player1)
// -mettere lo stato del gioco come -in corso
// -mostrare sullo schermo "turno player1"

// stato del gioco:
// -dovrò avere due liste che segnano le posizioni delle navi dove sono state messe
// -indicare se il gioco è in corso o finito, nel caso che è finito indicare chi ha vinto

// gestione del click del gioco:
// -capire quale cella è stata cliccata
// -se in quella cella c era una nave allora aggiungere hit nel caso contrario aggiungere un miss
// -nel caso che è colpita marcare la cella come "hit"
// -non permettere di cliccare due volte su una stessa cella gia scelta in precedenza
// -quindi magari mettere la cosa se hai cliccato su una cella, quest ultima si colora di rosso per segnare che è stata gia cliccata
// -al termine del click dopo aver saputo se hit o miss passare al turno dell altro player

// Fine del gioco:
// -quando non ci sono piu navi sulle celle mettere lo stato del gioco in finito
// -decretare il vincitore
// -non far continuare il gioco

// reset:
// -clicchi sul tasto reset e ricomincia il gioco
// -con la griglia vuota e la possibilita di mettere le navi da capo.
// -impostare di nuovo il primo turno
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
    messageEl.textContent = "HIT! Player 2's turn";
  } else {
    evt.target.classList.add('miss');
    messageEl.textContent = "MISS! Player 2's turn";
  }

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
    messageEl.textContent = "HIT! Player 1's turn";
  } else {
    evt.target.classList.add('miss');
    messageEl.textContent = "MISS! Player 1's turn";
  }

  currentPlayer = 'player1';

  // torna il turno a Player 1: nascondi P2 e mostra P1
  player2BoardEl.classList.add('hide-ships');
  player1BoardEl.classList.remove('hide-ships');
});


resetBtnEl.addEventListener('click', init); //reset ovviamente

/*---------------------------------- Init -----------------------------------*/
init();
