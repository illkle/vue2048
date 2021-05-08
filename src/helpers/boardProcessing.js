/* eslint-disable no-unused-vars */
import { v4 as uuid } from "uuid";

///ELEMENT SCHEMA
//const element = { id: "UUID-GENERATED", val: 2 };

const EMPTY_CELL = "empty";

const getRandomVal = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const countBoardSum = (board) => {
  return board
    .reduce((a, b) => a.concat(b))
    .reduce((a, b) => {
      let result = 0;
      if (a.val !== EMPTY_CELL) {
        result += Number(a.val);
      }
      if (b.val !== EMPTY_CELL) {
        result += Number(b.val);
      }
      return { val: result };
    }).val;
};

const checkArrayEquality = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

const loseCheck = (board) => {
  for (let x = 0; x < board[0].length; x++) {
    for (let y = 0; y < board.length; y++) {
      if (board[y][x] === EMPTY_CELL) {
        return false;
      }
    }
  }

  let boardInitialState = JSON.stringify(board);

  let movedBoard = moveLeft(board);

  if (checkArrayEquality(board, movedBoard) === false) {
    return false;
  }
  movedBoard = moveRight(JSON.parse(boardInitialState));
  if (checkArrayEquality(board, movedBoard) === false) {
    return false;
  }
  movedBoard = moveDown(JSON.parse(boardInitialState));
  if (checkArrayEquality(board, movedBoard) === false) {
    return false;
  }
  movedBoard = moveUp(JSON.parse(boardInitialState));
  if (checkArrayEquality(board, movedBoard) === false) {
    return false;
  }

  return true;
};

const initBoard = (x, y) => {
  return Array.from(Array(y), () =>
    Array(x).fill({ id: uuid(), val: EMPTY_CELL })
  );
};

const addTwoToRandomPlace = (board) => {
  let boardSizeX = board[0].length;
  let boardSizeY = board.length;

  let x = getRandomVal(0, boardSizeX);
  let y = getRandomVal(0, boardSizeY);

  const boardSize = boardSizeX * boardSizeY;
  let tried = 0;

  while (board[y][x].val !== EMPTY_CELL && tried < boardSize) {
    x = getRandomVal(0, boardSizeX);
    y = getRandomVal(0, boardSizeY);
    tried++;
  }

  if (tried < boardSize) {
    board[y][x] = { id: uuid(), val: 2 };
  }
  return board;
};

const gravity = (line) => {
  const grav = [];
  let previous = "none";
  for (let i = 0; i < line.length; i++) {
    const elem = line[i];
    if (elem.val !== EMPTY_CELL) {
      if (elem.val === previous.val) {
        grav[grav.length - 1].val = String(Number(elem.val) * 2);
        previous = "none";
      } else {
        previous = elem;
        grav.push(elem);
      }
    }
  }

  const remainder = Array(line.length - grav.length).fill({
    id: uuid(),
    val: EMPTY_CELL,
  });
  const newLine = grav.concat(remainder);
  return newLine;
};

const moveLeft = (board) => {
  return board.map((line) => gravity(line));
};

const moveRight = (board) => {
  const newBoard = board.map((line) => gravity(line.reverse()).reverse());
  return newBoard;
};

const moveUp = (board) => {
  const moved = [...board];

  for (let x = 0; x < moved[0].length; x++) {
    const toProcess = [];

    for (let y = 0; y < moved.length; y++) {
      toProcess.push(moved[y][x]);
    }

    const processed = gravity(toProcess);

    for (let y = 0; y < moved.length; y++) {
      moved[y][x] = processed[y];
    }
  }
  return moved;
};

const moveDown = (board) => {
  const moved = [...board];

  for (let x = 0; x < moved[0].length; x++) {
    const toProcess = [];

    for (let y = moved.length - 1; y >= 0; y--) {
      toProcess.push(moved[y][x]);
    }

    const processed = gravity(toProcess);

    for (let y = moved.length - 1; y >= 0; y--) {
      moved[y][x] = processed[moved.length - 1 - y];
    }
  }
  return moved;
};

export default {
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  gravity,
  initBoard,
  addTwoToRandomPlace,
  countBoardSum,
  loseCheck,
  EMPTY_CELL,
};
