'use strict';
/*
// Exercise 60 - Game of Life
// 
// The Game of Life is a simulation of how a population of creatures evolves from one generation to the next, based on a set of simple rules. This colony is described by a matrix of a user determined size, where each cell is either populated by a creature (marked by an asterisk '*'), or vacant. As with any matrix, each cell can have 8 neighboring cells at the most.
// 
// Start with a population of your choice, for example:
// 
// Here are the rules which govern the evolution of the colony:
// 
// if a creature has 0 – 2 neighboring creatures, it will die of loneliness and the cell which it occupies will become vacant in the next generation.
// if a cell has 3 – 5 occupied neighboring cells, it will have a creature in it in the next generation – either a newborn creature or the creature which previously occupied it.
// if a creature has 6 – 8 occupied neighboring creatures, it will suffocate and die, and the cell which it occupies will become vacant in the next generation.
// 
// Tip: use setInterval to run a function which looks something like this:
// 
//         function play()
//             gBoard = runGeneration(gBoard)	
//             renderBoard(gBoard) 
//         }
//     
// 
// Tip: use a second matrix to generate the new generations of the colony so that you do not modify the current state of the colony while still calculating the next generation.
*/
console.log('--- Exercise 60 ---');

var ROWS_ON_BOARD = 8;
var COLS_ON_BOARD = 10;
var CREATURE = '*';

var gBoard, gTime, gGameInterval;

init();

function init() {
  gBoard = createGameOfLifeBoard();
  gTime = Date.now();
  gGameInterval = setInterval(play, 1500);
}

function play() {
  gBoard = createNextGenBoard(gBoard);
  renderBoard(gBoard);
  if (Date.now() - gTime >= 15000) clearInterval(gGameInterval);
}

// var matrix = createGameOfLifeBoard();

// matrix = createNextGenBoard(matrix);
// renderBoard(matrix);

function renderBoard(mat) {
  console.table(mat);
}

function createNextGenBoard(board) {
  const newBoard = JSON.parse(JSON.stringify(board));

  for (let i = 0; i < ROWS_ON_BOARD; i++) {
    for (let j = 0; j < COLS_ON_BOARD; j++) {
      let neighbors = checkNeighbors(board, i, j);
      if (neighbors > 2 && neighbors < 6) newBoard[i][j] = '*';
      else newBoard[i][j] = '';
    }
  }

  // const newBoard = newBoard.structuredClone();
  // const creaturePos = checkCreaturePos(newBoard);
  // for (let i = 0; i < creaturePos.length; i++) {
  //   let neighbors = checkNeighbors(board, creaturePos[i][0], creaturePos[i][1]);
  //   if (neighbors < 3 || neighbors > 5) {
  //     newBoard[creaturePos[i][0]][creaturePos[i][1]] = '';
  //   }
  // }

  return newBoard;
}

// TODO: create new creatures when sorrounded by 3 creatures and cell is vacant

function checkNeighbors(mat, rowIdx, columnIdx) {
  let neighbors = 0;
  for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i >= mat.length || i < 0) continue;

    for (let j = columnIdx - 1; j <= columnIdx + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue;
      if (i === rowIdx && j === columnIdx) continue;
      if (mat[i][j] === CREATURE) neighbors++;
    }
  }
  return neighbors;
}

function createGameOfLifeBoard() {
  const matrix = [];
  const empty = '';

  for (let i = 0; i < ROWS_ON_BOARD; i++) {
    matrix[i] = [];
    for (let j = 0; j < COLS_ON_BOARD; j++) matrix[i][j] = empty;
  }
  spreadCreaturesRandomly(matrix);

  console.table(matrix);
  return matrix;
}

function spreadCreaturesRandomly(mat) {
  let randomNumOfCreatures = Math.trunc(
    getRandomInc(
      (ROWS_ON_BOARD * COLS_ON_BOARD) / 10,
      (ROWS_ON_BOARD * COLS_ON_BOARD) / 2
    )
  );

  while (randomNumOfCreatures) {
    let randomRow = getRandomInc(0, ROWS_ON_BOARD - 1);
    let randomColumn = getRandomInc(0, COLS_ON_BOARD - 1);
    mat[randomRow][randomColumn] = CREATURE;
    randomNumOfCreatures--;
  }
}

function getRandomInc(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkCreaturePos(mat) {
  const indexOfCreatures = [];
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      if (mat[i][j]) indexOfCreatures.push([i, j]);
    }
  }
  return indexOfCreatures;
}

// function checkIfOver(mat) {
//   for (let i = 0; i < mat.length; i++) {
//     for (let j = 0; j < mat[i].length; j++) {
//       if (mat[i][j] === creature) return false;
//     }
//   }
//   return true;
// }
