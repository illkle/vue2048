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
      if (board[y][x] === EMPTY_CELL) {
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

const initBoard = (x, y) => {
  const field = Array.from(Array(y), () =>
    Array(x).fill({ id: uuid(), val: EMPTY_CELL })
  );
  return { field, remainder: ["yoo"] };
};

const addTwoToRandomPlace = (boardObj) => {
  const board = boardObj.field;
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
  return { field: board, remainder: boardObj.remainder };
};

const gravity = (line) => {
  const grav = [];
  const rest = [];
  let previous = "none";
  for (let i = 0; i < line.length; i++) {
    const elem = line[i];
    if (elem.val !== EMPTY_CELL) {
      if (elem.val === previous.val) {
        grav[grav.length - 1].val = String(Number(elem.val) * 2);
        previous = "none";
        rest.push(elem);
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
  return { newLine, rest };
};

const moveLeft = (boardObj) => {
  const board = boardObj.field;
  let rem = [];
  const result = board.map((line) => {
    const result = gravity(line);
    if (result.rest.length > 0) {
      rem = rem.concat(result.rest);
    }
    return result.newLine;
  });
  return { field: result, remainder: rem };
};

const moveRight = (boardObj) => {
  const board = boardObj.field;
  let rem = [];
  const result = board.map((line) => {
    const result = gravity(line.reverse());
    if (result.rest.length > 0) {
      rem = rem.concat(result.rest);
    }
    return result.newLine.reverse();
  });

  return { field: result, remainder: rem };
};

const moveUp = (boardObj) => {
  const board = boardObj.field;

  let rem = [];

  for (let x = 0; x < board[0].length; x++) {
    const toProcess = [];

    for (let y = 0; y < board.length; y++) {
      toProcess.push(board[y][x]);
    }

    const result = gravity(toProcess);
    const processed = result.newLine;
    if (result.rest.length > 0) {
      rem = rem.concat(result.rest);
    }

    for (let y = 0; y < board.length; y++) {
      board[y][x] = processed[y];
    }
  }
  return { field: board, remainder: rem };
};

const moveDown = (boardObj) => {
  const board = boardObj.field;

  let rem = [];

  for (let x = 0; x < board[0].length; x++) {
    const toProcess = [];

    for (let y = board.length - 1; y >= 0; y--) {
      toProcess.push(board[y][x]);
    }

    const result = gravity(toProcess);
    const processed = result.newLine;
    if (result.rest.length > 0) {
      rem = rem.concat(result.rest);
    }

    for (let y = board.length - 1; y >= 0; y--) {
      board[y][x] = processed[board.length - 1 - y];
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
  EMPTY_CELL,
};
