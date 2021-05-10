/* eslint-disable no-unused-vars */
import b from "../../src/helpers/boardProcessing";

import { v4 as uuid } from "uuid";

const X = b.EMPTY_CELL;

const encodeLine = (line) =>
  line.map((value) => {
    return { id: uuid(), val: value };
  });

const encodeBoard = (board) => {
  return { field: board.map((line) => encodeLine(line)) };
};

const decodeLine = (line) => line.map((obj) => obj.val);

const decodeBoard = (board) => {
  return board.map((line) => decodeLine(line));
};

describe("Basic Gravity", () => {
  it("Gravity works for moving stuff", () => {
    const initial = encodeLine([X, "4", X, "8"]);
    const expected = ["4", "8", X, X];
    const expectedRem = [X, X, X, X];

    expect(decodeLine(b.gravity(initial).newLine)).toStrictEqual(expected);
    expect(decodeLine(b.gravity(initial).rest)).toStrictEqual(expectedRem);
  });
  it("Gravity works merging stuff", () => {
    const initial = encodeLine(["4", "4", "8", "8"]);
    const expected = ["8", "16", X, X];
    const expectedRem = ["4", "8", X, X];

    const result = b.gravity(initial);
    const newLine = decodeLine(result.newLine);
    const rest = decodeLine(result.rest);

    expect(newLine).toStrictEqual(expected);
    expect(rest).toStrictEqual(expectedRem);
    expect(result.rest[0].id).toBe(initial[1].id);
    expect(result.rest[1].id).toBe(initial[3].id);
  });
  it("Gravity works moving and merging", () => {
    const initial = encodeLine(["4", X, X, "4", "2", "16", X, "16"]);
    const expected = ["8", "2", "32", X, X, X, X, X];
    const expectedRem = ["4", X, "16", X, X, X, X, X];

    const result = b.gravity(initial);
    const newLine = decodeLine(result.newLine);
    const rest = decodeLine(result.rest);

    expect(newLine).toStrictEqual(expected);
    expect(rest).toStrictEqual(expectedRem);
    expect(result.rest[0].id).toBe(initial[3].id);
    expect(result.rest[2].id).toBe(initial[7].id);
  });

  it("Gravity works when merging several adjacent", () => {
    const initial = encodeLine(["4", X, X, "4", "2", "16", "16", "16"]);
    const expected = ["8", "2", "32", "16", X, X, X, X];
    const expectedRem = ["4", X, "16", X, X, X, X, X];

    const result = b.gravity(initial);
    const newLine = decodeLine(result.newLine);
    const rest = decodeLine(result.rest);

    expect(newLine).toStrictEqual(expected);
    expect(rest).toStrictEqual(expectedRem);
    expect(result.rest[0].id).toBe(initial[3].id);
    expect(result.rest[2].id).toBe(initial[6].id);
  });
});

describe("Moves", () => {
  it("Moves left correctly", () => {
    const initial = encodeBoard([
      [X, "2", "2", X],
      [X, "8", "4", "8"],
      [X, "2", "16", "16"],
      ["32", "16", "16", X],
    ]);

    const expected = [
      ["4", X, X, X],
      ["8", "4", "8", X],
      ["2", "32", X, X],
      ["32", "32", X, X],
    ];

    const expectedRem = [
      ["2", X, X, X],
      [X, X, X, X],
      [X, "16", X, X],
      [X, "16", X, X],
    ];

    const result = b.moveLeft(initial);
    const field = decodeBoard(result.field);
    const remainder = decodeBoard(result.remainder);

    expect(field).toStrictEqual(expected);
    expect(remainder).toStrictEqual(expectedRem);
    expect(result.remainder[0][0]).toStrictEqual(initial.field[0][2]);
    expect(result.remainder[2][1]).toStrictEqual(initial.field[2][3]);
    expect(result.remainder[3][1]).toStrictEqual(initial.field[3][2]);
  });
  it("Moves right correctly", () => {
    const initial = encodeBoard([
      [X, "2", "2", X],
      ["4", "8", X, "8"],
      [X, "2", X, X],
      ["32", "16", "16", "4"],
    ]);

    const expected = [
      [X, X, X, "4"],
      [X, X, "4", "16"],
      [X, X, X, "2"],
      [X, "32", "32", "4"],
    ];
    const expectedRem = [
      [X, X, X, "2"],
      [X, X, X, "8"],
      [X, X, X, X],
      [X, X, "16", X],
    ];

    const result = b.moveRight(initial);
    const field = decodeBoard(result.field);
    const remainder = decodeBoard(result.remainder);

    expect(field).toStrictEqual(expected);
    expect(remainder).toStrictEqual(expectedRem);
    expect(result.remainder[0][3]).toStrictEqual(initial.field[0][1]);
    expect(result.remainder[1][3]).toStrictEqual(initial.field[1][1]);
    expect(result.remainder[3][2]).toStrictEqual(initial.field[3][1]);
  });

  it("Moves up correctly", () => {
    const initial = encodeBoard([
      [X, "2", "2", X],
      ["4", X, X, "8"],
      ["4", "2", "4", X],
      ["32", "16", X, X],
    ]);

    const expected = [
      ["8", "4", "2", "8"],
      ["32", "16", "4", X],
      [X, X, X, X],
      [X, X, X, X],
    ];

    const expectedRem = [
      ["4", "2", X, X],
      [X, X, X, X],
      [X, X, X, X],
      [X, X, X, X],
    ];

    const result = b.moveUp(initial);

    const field = decodeBoard(result.field);
    const remainder = decodeBoard(result.remainder);
    expect(field).toStrictEqual(expected);
    expect(remainder).toStrictEqual(expectedRem);
    expect(result.remainder[0][0]).toStrictEqual(initial.field[2][0]);
    expect(result.remainder[0][1]).toStrictEqual(initial.field[2][1]);
  });

  it("Moves down correctly", () => {
    const initial = encodeBoard([
      [X, "2", "2", X],
      ["4", X, X, "8"],
      ["4", "2", "4", X],
      ["32", X, X, X],
    ]);

    const expected = [
      [X, X, X, X],
      [X, X, X, X],
      ["8", X, "2", X],
      ["32", "4", "4", "8"],
    ];

    const expectedRem = [
      [X, X, X, X],
      [X, X, X, X],
      ["4", X, X, X],
      [X, "2", X, X],
    ];

    const result = b.moveDown(initial);

    const field = decodeBoard(result.field);
    const remainder = decodeBoard(result.remainder);
    expect(field).toStrictEqual(expected);
    expect(remainder).toStrictEqual(expectedRem);
    expect(result.remainder[2][0]).toStrictEqual(initial.field[1][0]);
    expect(result.remainder[3][1]).toStrictEqual(initial.field[0][1]);
  });
});

describe("Utility Function", () => {
  it("Board Sum works", () => {
    const initial = [
      [X, X, "2"],
      [X, "4", "2"],
      [X, X, X],
    ];
    expect(b.countBoardSum(encodeBoard(initial))).toBe(8);
  });
});

describe("Adding Random Twos", () => {
  it("Correctly add twos", () => {
    let board = [
      [X, X, X],
      [X, X, X],
      [X, X, X],
    ];

    board = b.addTwoToRandomPlace(encodeBoard(board));
    board = b.addTwoToRandomPlace(board);
    board = b.addTwoToRandomPlace(board);
    board = b.addTwoToRandomPlace(board);
    board = b.addTwoToRandomPlace(board);

    expect(b.countBoardSum(board)).toBe(10);
  });
  it("Doesn't add two if the board is full", () => {
    let board = [
      ["4", "4", "4"],
      ["4", "4", "4"],
      ["4", "4", "4"],
    ];

    board = b.addTwoToRandomPlace(encodeBoard(board));

    expect(b.countBoardSum(board)).toBe(36);
  });
});

describe("Lose Check", () => {
  it("Return false for half empty board", () => {
    let board = encodeBoard([
      [X, X, X, X],
      ["2", X, "8", X],
      [X, "4", X, X],
      [X, "32", X, "16"],
    ]);

    expect(b.loseCheck(board)).toBe(false);
  });

  it("Return false for full board with possible move horizontally", () => {
    let board = encodeBoard([
      ["4", "8", "16", "16"],
      ["2", "4", "8", "4"],
      ["128", "8", "128", "32"],
      ["16", "32", "64", "16"],
    ]);

    expect(b.loseCheck(board)).toBe(false);
  });

  it("Return false for full board with possible move vertically", () => {
    let board = encodeBoard([
      ["4", "2", "4", "16"],
      ["2", "16", "8", "4"],
      ["128", "16", "128", "32"],
      ["16", "32", "64", "16"],
    ]);

    expect(b.loseCheck(board)).toBe(false);
  });
  it("Return true for full board with no possible moves", () => {
    let board = encodeBoard([
      ["4", "2", "4", "16"],
      ["2", "16", "8", "4"],
      ["128", "256", "128", "32"],
      ["16", "32", "64", "16"],
    ]);

    expect(b.loseCheck(board)).toBe(true);
  });
});
