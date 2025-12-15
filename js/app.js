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

  currentPlayer = 'player1';
  positionBoatPlayer1 = [];
  positionBoatPlayer2 = [];

  messageEl.textContent = "Player 1's turn";
};

/*----------------------------- Event Listeners -----------------------------*/
player1BoardEl.addEventListener('click', (evt) => {
  if (currentPlayer !== 'player1') return;
  if (!evt.target.classList.contains('cell')) return;

  const index = Number(evt.target.dataset.index);
  if (positionBoatPlayer1.includes(index)) return;

  evt.target.classList.add('ship');
  positionBoatPlayer1.push(index);

  messageEl.textContent = `Player 1 placing ships: ${positionBoatPlayer1.length}`;

  // quando Player 1 ha piazzato 3 celle, passa a Player 2
  if (positionBoatPlayer1.length === 3) {
    currentPlayer = 'player2';
    messageEl.textContent = "Player 2's turn";
  }
});

resetBtnEl.addEventListener('click', init); //reset ovviamente

/*---------------------------------- Init -----------------------------------*/
init();
