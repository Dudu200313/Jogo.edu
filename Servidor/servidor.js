const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path'); // Import the 'path' module

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const gameData = {
  players: [],
  board: Array(9).fill(null),
  currentPlayer: 0,
  winner: null,
};

io.on('connection', (socket) => {
  console.log('A user connected');

  // ... (rest of your code)

});

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameData.board[a] !== null && gameData.board[a] === gameData.board[b] && gameData.board[a] === gameData.board[c]) {
      return true;
    }
  }

  return false;
}

// Adding global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Move the route below the import statement for 'path'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Cliente/index.html'));
  });

// Adding a try-catch block for server.listen to handle synchronous errors during startup
try {
    server.listen(3000, '10.35.5.80', () => {
      console.log(`Server is running on http://10.35.5.80:${PORT}`);
    });
} catch (error) {
    console.error('Error during server startup:', error);
}

