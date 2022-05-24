'use strict';
/*
// Exercise 59 - BINGO
// 
// Your challenge is to implement the famous game of BINGO. In this version of the game, there are two players. Numbers are drawn at random, and each player marks the number if it appears in his board. The first player to mark all the numbers on his board, wins.
// 
// Here is the suggested data structure:
// 
//         var gPlayers = [
//             {name: ‘Muki’, hitCount: 0, board: createBingoBoard()},
//             {name: ‘Puki, hitCount: 0, board: createBingoBoard()}
//         ]
//     
// 
// Every cell in board will hold an object like {value: 17, isHit: false}
// 
// It is common practice to implement our code in several stages, starting with simplified version for some of the functions, which allow us to test other parts of our code first. Let’s try this approach:
// 
// Implement the createBingoBoard() function: It returns a 5 by 5 matrix containing cell object as described above, with the numbers 1 – 25 (Later on we will change it to 1 – 99).
// 
// Implement the function printBingoBoard(board) which prints the board by showing the number (value) in each cell.
// 
// If isHit is true, add 'v' to the printed number.
// 
// Check your function by manually setting a cell's isHit to true like this: gPlayers[0].board[0][0].isHit = true and printing the board (remember you can run code from the console).
// 
// Implement some empty (placeholder) functions:
// 
// drawNum() code a simple function returning a fixed number (e.g. 17)
// markBoard() an empty function for now.
// checkBingo() a simple function returning true (note, that if it returns false it will cause an infinite loop).
// 
// Implement the playBingo function:
// 
// Implement the markBoard function:
// 
// If the board contains a cell with calledNum in its value, update that cell's isHit value accordingly and increase the player’s hitCount .
// Use the printBingoBoard function to debug your function and make sure it works correctly.
// 
// Implement the checkBingo function – Just check if the player’s hitCount has reached 25.
// 
// Implement the drawNum function:
// 
// We will later need this function to return a unique random number, so we will use an array - gNums.
// Add the function resetNums which updates the global variable gNums to be an array with the numbers 1 – 25. This function should be called at the beginning of createBoard and also at the beginning of the playBingo function.
// The function drawNum can just pop from that array for now (predictable order helps while developing)
// 
// Make sure you have a basic working game that ends after 25 iterations before moving on
// 
// Implement the following additions and modification:
// 
// The gNums array should hold the numbers from 1 to 99.
// 
// drawNum should return a random number from the array. Use splice for that, to make sure the drawn numbers do not repeat.
// 
// Print a happy greeting when a player –
// 
// completes a row – ‘Muki has completed a row!’.
// completes the main diagonal – ‘Muki has completed the main diagonal!’
// completes the secondary diagonal – ‘Muki has completed the secondary diagonal!’.
// 
// Slow down the game so it feels more realistic and easy to follow:
// 
// Use setInterval instead of the while loop: var gameInterval = setInterval(playTurn, 1000)
// Use clearInterval(gameInterval) when the game is over.
// 
// Finalizing
// 
// How easy would it be to make your game to work with a 6 by 6 Bingo board?
// 
// How easy would it be, to add more players?
*/
console.log('--- Exercise 59 ---');

var gIsRunning = false;
const BOARD_SIZE = 5; // Note: Board size by size
const btn = document.querySelector('.btn-bingo');
const modal = document.querySelector('.modal');
const elGame1 = document.querySelector('header');
const elGame2 = document.querySelector('.game2');
var gNums = resetNums();
var gGameInterval;
var gTimeout;
btn.addEventListener('click', init);

var gPlayers = [
  {
    name: 'Muki',
    hitCount: 0,
    rows: [],
    elName: document.querySelector('.player'),
    matrixPlayerEl: document.querySelector('.p1'),
    board: createBingoBoard(),
  },
  {
    name: 'Puki',
    hitCount: 0,
    rows: [],
    elName: document.querySelector('.opponent'),
    matrixPlayerEl: document.querySelector('.p2'),
    board: createBingoBoard(),
  },
];

function init() {
  if (gIsRunning) return;
  gPlayers.forEach(player => {
    delete player.isSecDiagonal;
    delete player.isMainDiagonal;
    player.rows = [];
    player.hitCount = 0;
    player.board = createBingoBoard();
  });
  closeModal();
  resetNums();
  displayOnScreen(gPlayers);
  gGameInterval = setInterval(playTurn, 1000);
}
function playTurn() {
  gIsRunning = true;
  var isVictory = false;
  var calledNum = drawNum();

  for (var i = 0; !isVictory && i < gPlayers.length; i++) {
    var player = gPlayers[i];
    let changed = markBoard(player, calledNum);
    if (changed) isVictory = checkBingo(player);
  }

  // for (let i = 0; i < gPlayers.length; i++) {
  //   if (gPlayers[i].hitCount === BOARD_SIZE ** 2)
  //     console.log(
  //       `Congratulations🎆🎆🎆 ${gPlayers[i].name} you have won the game`,
  //     );
  // }

  if (isVictory) {
    let msg = `🎆Congratulations ${
      gPlayers[i - 1].elName.textContent
    } you have won the game🎆`;
    console.log(msg);

    clearInterval(gGameInterval);
    clearTimeout(gTimeout);
    openModal(msg);
    gIsRunning = false;
  }
  isVictory = false;
}

function displayOnScreen(players) {
  for (let i = 0; i < players.length; i++) {
    players[i].boardOnScreen = renderBoard(players[i]);
  }
}

function printBingoBoard(board) {
  let visualBoard = [];
  for (let j = 0; j < BOARD_SIZE; j++) {
    visualBoard[j] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (!board[j][i].isHit) visualBoard[j][i] = board[j][i].value;
      else if (typeof board[j][i].value === 'number') board[j][i].value = '✅';
      if (board[j][i].isMainDiagonal) board[i][i].value = '💘';
      visualBoard[j][i] = board[j][i].value;
    }
  }
  console.table(visualBoard);
  console.log('-'.repeat(31));
}

function renderBoard(player) {
  let html = '';
  for (let i = 0; i < BOARD_SIZE; i++) {
    html += `<tr>`;

    for (let j = 0; j < BOARD_SIZE; j++) {
      html += `
      <td>${player.board[i][j].value}</td>`;
    }
    html += `</tr>`;
  }
  player.matrixPlayerEl.innerHTML = html;
  // getting players name from user if exists returns
  if (player.elName.innerHTML) return;
  player.elName.innerHTML = prompt('Enter player Name:');
}

function drawNum() {
  const random = getRandomInc(0, gNums.length);
  return gNums.splice(random, 1)[0];
}

function markBoard(player, calledNum) {
  let curHitCount = player.hitCount;
  for (const key in player.board) {
    //
    const row = player.board[key];

    for (let i = 0; i < row.length; i++) {
      if (calledNum === row[i].value) {
        row[i].isHit = true;
        player.hitCount++;
      }
    }
  }
  if (curHitCount === player.hitCount) return false;
  else {
    greetPlayer(player, player.board);
    printBingoBoard(player.board);
    renderBoard(player);
    return true;
  }
}

function checkBingo(player) {
  return player.hitCount === BOARD_SIZE ** 2;
}

function createBingoBoard() {
  resetNums();
  // Bingo number pull possibilites
  const BINGO_START = Math.min(...gNums);
  const BINGO_END = Math.max(...gNums);

  const matrix = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    matrix[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      matrix[i][j] = {
        value: getRandomInc(BINGO_START, BINGO_END),
        isHit: false,
      };
    }
  }

  return matrix;
}

function getRandomInc(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function fillArray(start, end) {
  const arr = [];
  for (let i = 0; i < end; i++) {
    arr[i] = start + i;
  }
  return arr;
}

function greetPlayer(player, board) {
  let msg = '';
  if (isMainDiagonalMarked(board) && !player.isMainDiagonal) {
    msg += `${player.elName.textContent} has marked main diagonal `;
    console.log(msg);
    player.isMainDiagonal = true;
    isMainDiagonalMarked(board, '💘');
  }
  if (isSecondaryDiagonalMarked(board) && !player.isSecDiagonal) {
    msg += `${player.elName.textContent} has marked secondary diagonal `;
    console.log(msg);
    player.isSecDiagonal = true;
    isSecondaryDiagonalMarked(board, '💘');
  }
  for (var i = 0; i < board.length; i++)
    if (isRowsMarked(board, i) && !player.rows.includes(i)) {
      msg += `${player.elName.textContent} has marked row ${i + 1} `;
      console.log(msg);
      player.rows.push(i);
    }
  if (msg) {
    openModal(msg);
    gTimeout = setTimeout(closeModal, 3000);
  }
}

function isMainDiagonalMarked(board, sign) {
  for (let i = 0; i < board.length; i++) {
    if (sign) {
      board[i][i].value = sign;
      continue;
    }
    if (!board[i][i].isHit) return false;
  }
  return true;
}
function isSecondaryDiagonalMarked(board, sign) {
  for (let i = 0; i < board.length; i++) {
    if (sign) {
      board[i][board.length - 1 - i].value = sign;
      continue;
    }
    if (!board[i][board.length - 1 - i].isHit) return false;
  }
  return true;
}
function isRowsMarked(board, index) {
  for (let i = 0; i < board.length; i++) {
    if (!board[index][i].isHit) return false;
  }
  return true;
}

function resetNums() {
  return (gNums = fillArray(1, 25));
}
function openModal(msg) {
  modal.classList.remove('hidden');
  modal.innerHTML = `<button onclick="closeModal">x</button><h2>${msg}</h2>`;
}
function closeModal() {
  modal.classList.add('hidden');
}
function changePage(elBtn) {
  elGame1.classList.toggle('hidden');
  elGame2.classList.toggle('hidden');
  if (elBtn) initGame2();
}
