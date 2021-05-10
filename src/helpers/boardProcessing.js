/* eslint-disable no-unused-vars */
import { v4 as uuid } from "uuid";

///ELEMENT SCHEMA
//const element = { id: "UUID-GENERATED", val: 2 };

const EMPTY_CELL = "empty";

const getRandomVal = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const countBoardSum = (boardObj) => {
  const board = boardObj.field;
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

const loseCheck = (boardObj) => {
  const board = boardObj.field;
  for (let x = 0; x < board[0].length; x++) {
    for (let y = 0; y < board.length; y++) {
      if (board[y][x].val === EMPTY_CELL) {
        return false;
      }
    }
  }

  const boardInitialState = JSON.stringify(board);

  const getInitialBoard = () => {
    return { field: JSON.parse(boardInitialState) };
  };

  let movedBoard = moveLeft(getInitialBoard());

  if (checkArrayEquality(board, movedBoard.field) === false) {
    return false;
  }
  movedBoard = moveRight(getInitialBoard());
  if (checkArrayEquality(board, movedBoard.field) === false) {
    return false;
  }
  movedBoard = moveDown(getInitialBoard());
  if (checkArrayEquality(board, movedBoard.field) === false) {
    return false;
  }
  movedBoard = moveUp(getInitialBoard());
  if (checkArrayEquality(board, movedBoard.field) === false) {
    return false;
  }

  return true;
};

const winCheck = (boardObj) => {
  const board = boardObj.field;
  for (let x = 0; x < board[0].length; x++) {
    for (let y = 0; y < board.length; y++) {
      if (board[y][x].val >= 2048) {
        return true;
      }
    }
  }

  return false;
};

const initBoard = (x, y) => {
  const field = Array.from(Array(y), () => Array(x).fill({ val: EMPTY_CELL }));
  return { field };
};

const addTwoToRandomPlace = (boardObj) => {
  const board = boardObj.field;
  let boardSizeX = board[0].length;
  let boardSizeY = board.length;

  let addingProbability = (boardSizeX * boardSizeY) / 16;

  while (addingProbability > 0) {
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
      addingProbability -= 1;
    } else {
      addingProbability = 0;
    }
  }

  return { field: board, remainder: boardObj.remainder };
};

const gravity = (line) => {
  const grav = [];
  let rest = [];
  let previous = "none";
  for (let i = 0; i < line.length; i++) {
    const elem = line[i];
    if (elem.val !== EMPTY_CELL) {
      if (elem.val === previous.val) {
        grav[grav.length - 1].val = String(Number(elem.val) * 2);
        previous = "none";
        rest[rest.length - 1] = elem;
      } else {
        previous = elem;
        grav.push(elem);
        rest.push({ val: EMPTY_CELL });
      }
    }
  }

  const remainder = Array(line.length - grav.length).fill({
    val: EMPTY_CELL,
  });
  const remainder2 = Array(line.length - rest.length).fill({
    val: EMPTY_CELL,
  });
  const newLine = grav.concat(remainder);
  rest = rest.concat(remainder2);
  return { newLine, rest };
};

const moveLeft = (boardObj) => {
  const board = boardObj.field;
  let rem = [];
  const result = board.map((line) => {
    const result = gravity(line);
    rem.push(result.rest);
    return result.newLine;
  });
  return { field: result, remainder: rem };
};

const moveRight = (boardObj) => {
  const board = boardObj.field;
  let rem = [];
  const result = board.map((line) => {
    const lineCopy = [...line];
    lineCopy.reverse();
    const result = gravity(lineCopy);
    result.newLine.reverse();
    result.rest.reverse();
    rem.push(result.rest);
    return result.newLine;
  });

  return { field: result, remainder: rem };
};

const moveUp = (boardObj) => {
  const board = JSON.parse(JSON.stringify(boardObj.field));

  let rem = initBoard(board[0].length, board.length).field;

  for (let x = 0; x < board[0].length; x++) {
    const toProcess = [];

    for (let y = 0; y < board.length; y++) {
      toProcess.push(board[y][x]);
    }

    const result = gravity(toProcess);
    const processed = result.newLine;
    const remainder = result.rest;

    for (let y = 0; y < board.length; y++) {
      board[y][x] = processed[y];
      rem[y][x] = remainder[y];
    }
  }
  return { field: board, remainder: rem };
};

const moveDown = (boardObj) => {
  const board = JSON.parse(JSON.stringify(boardObj.field));

  let rem = initBoard(board[0].length, board.length).field;

  for (let x = 0; x < board[0].length; x++) {
    const toProcess = [];

    for (let y = board.length - 1; y >= 0; y--) {
      toProcess.push(board[y][x]);
    }

    const result = gravity(toProcess);
    const processed = result.newLine;
    const remainder = result.rest;

    for (let y = board.length - 1; y >= 0; y--) {
      board[y][x] = processed[board.length - 1 - y];
      rem[y][x] = remainder[board.length - 1 - y];
    }
  }

  return { field: board, remainder: rem };
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
  winCheck,
  EMPTY_CELL,
};
