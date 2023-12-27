
const socket = io('http://10.35.5.80:3000');

let currentPlayer;
let playerIndex;
let winner;

socket.on('updatePlayers', (players) => {
  displayPlayers(players);
});

socket.on('gameFull', () => {
  alert('O jogo está cheio. Tente novamente mais tarde.');
  location.reload();
});

socket.on('startGame', () => {
  const playerName = prompt('Digite seu nome:');
  socket.emit('joinGame', playerName);
});

socket.on('gameData', (data) => {
  currentPlayer = data.currentPlayer;
  playerIndex = data.players.findIndex((p) => p.id === socket.id);

  displayPlayers(data.players);
  displayBoard(data.board);
  displayTurn();

  document.getElementById('board').addEventListener('click', handleCellClick);
});

socket.on('updateBoard', (board) => {
  displayBoard(board);
});

socket.on('updateTurn', (currentPlayer) => {
  currentPlayer = currentPlayer;
  displayTurn();
});

socket.on('gameOver', (result) => {
  if (result === 'draw') {
    alert('Empate! O jogo acabou.');
  } else {
    alert(`O jogador ${result + 1} venceu! O jogo acabou.`);
  }

  location.reload();
});

socket.on('resetGame', () => {
  location.reload();
});

function displayPlayers(players) {
  const playersDiv = document.getElementById('players');
  playersDiv.innerHTML = '';

  players.forEach((player, index) => {
    const playerDiv = document.createElement('div');
    playerDiv.textContent = `Jogador ${index + 1}: ${player.name}`;
    playersDiv.appendChild(playerDiv);
  });
}

function displayBoard(board) {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';

  board.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.textContent = cell !== null ? (cell === 0 ? 'X' : 'O') : '';
    boardDiv.appendChild(cellDiv);
  });
}

function displayTurn() {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = `É a vez do Jogador ${currentPlayer + 1}`;
}

function handleCellClick(event) {
  if (currentPlayer === playerIndex && !winner) {
    const index = Array.from(event.target.parentNode.children).indexOf(event.target);
    socket.emit('makeMove', index);
  }
}