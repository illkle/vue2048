<script>
import BoardView from "./components/BoardView.vue";
import boardProcessing from "./helpers/boardProcessing";
import { debounce } from "debounce";

export default {
  name: "App",
  components: {
    BoardView,
  },
  data() {
    return {
      board: [],
      lost: false,
      won: false,
      x: 4,
      y: 4,
      x_i: 4,
      y_i: 4,
      window: {
        width: 0,
        height: 0,
      },
      topScores: {},
    };
  },
  computed: {
    boardSize() {
      const cellSize = Math.min(
        (this.window.width - Math.min(100, this.window.width * 0.1)) / this.x,
        (this.window.height - 350) / this.y
      );
      return cellSize;
    },
    score() {
      if (!this.board.field) {
        return 0;
      }
      return boardProcessing.countBoardSum(this.board);
    },
    topScore() {
      if (!this.board.field) {
        return;
      }
      const boardCellsCount =
        this.board.field.length * this.board.field[0].length;
      if (this.topScores[boardCellsCount]) {
        return this.topScores[boardCellsCount];
      } else {
        return 0;
      }
    },
  },
  methods: {
    initBoard() {
      this.x = this.x_i;
      this.y = this.y_i;
      this.board = boardProcessing.initBoard(this.x, this.y);
      this.addTwoToRandomPlace();
      this.addTwoToRandomPlace();
    },
    addTwoToRandomPlace() {
      this.board = boardProcessing.addTwoToRandomPlace(this.board);
    },
    handlePressedButton(button) {
      const boardBefore = JSON.stringify(this.board.field);
      let boardAfter;
      switch (button) {
        case "ArrowUp":
          boardAfter = boardProcessing.moveUp(this.board);
          break;
        case "ArrowDown":
          boardAfter = boardProcessing.moveDown(this.board);
          break;
        case "ArrowLeft":
          boardAfter = boardProcessing.moveLeft(this.board);
          break;
        case "ArrowRight":
          boardAfter = boardProcessing.moveRight(this.board);
          break;
      }
      if (JSON.stringify(boardAfter.field) !== boardBefore) {
        this.board = boardAfter;
        this.addTwoToRandomPlace();
      }
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    winLoseChecks: debounce(function () {
      if (!this.board.field) {
        return;
      }

      this.lost = boardProcessing.loseCheck(this.board);

      if (this.won === true) {
        return;
      }
      const winCheckResult = boardProcessing.winCheck(this.board);

      if (winCheckResult === true) {
        this.won = true;
      }
    }, 250),
    updateTopScore: debounce(function () {
      const boardCellsCount =
        this.board.field.length * this.board.field[0].length;
      if (this.topScore < this.score) {
        this.topScores[boardCellsCount] = this.score;
        window.localStorage.setItem(
          "topScores",
          JSON.stringify(this.topScores)
        );
      }
    }, 1000),
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.initBoard();

    const savedScores = window.localStorage.getItem("topScores");
    if (savedScores) {
      this.topScores = JSON.parse(savedScores);
    }
  },
  created() {
    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        this.handlePressedButton(e.key);
      }
    });
    window.addEventListener("swiped-up", () => {
      this.handlePressedButton("ArrowUp");
    });
    window.addEventListener("swiped-down", () => {
      this.handlePressedButton("ArrowDown");
    });
    window.addEventListener("swiped-right", () => {
      this.handlePressedButton("ArrowRight");
    });
    window.addEventListener("swiped-left", () => {
      this.handlePressedButton("ArrowLeft");
    });
  },
  watch: {
    board() {
      this.winLoseChecks();
      this.updateTopScore();
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="info">
      <h1 class="title">2048</h1>
      <div class="menuContainer">
        <div class="newBox">
          X
          <input
            class="dimsInput"
            type="number"
            max="20"
            v-model.number="x_i"
          />
          Y
          <input
            class="dimsInput"
            type="number"
            max="20"
            v-model.number="y_i"
          />
          <button class="newGameButton" @click="initBoard()">START</button>
        </div>
        <div class="scoreBox">
          <span>SCORE:</span> {{ score }}<span>TOP_SCORE:</span>
          {{ topScore }}
        </div>
      </div>
    </div>
    <div
      class="boardHolder"
      :style="{
        width: `${boardSize * x + (this.window.width >= 768 ? 25 : 3)}px`,
      }"
    >
      <BoardView
        v-if="this.board.field"
        :board="board"
        :boardWidth="boardSize * x"
        :boardHeight="boardSize * y"
        :lost="lost"
        @restartGame="initBoard()"
      />
    </div>
    <div class="footer">
      <a href="https://github.com/ze-kel/vue2048">source code</a>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
body,
html {
  overflow: hidden;
}
#app {
  font-family: "Roboto Mono", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.info {
  max-height: 325px;
  padding-bottom: 15px;
}

.container {
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.title {
  font-weight: 900;
  font-size: 100px;
}

.menuContainer {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  font-weight: 700;
  font-size: 25px;
  justify-content: space-between;
  border-radius: 6px;
  padding: 15px 5px;
  background-color: rgb(24, 24, 24);
}

.scoreBox,
.newBox {
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
}

.scoreBox span {
  font-weight: 500;
}

.scoreBox {
  margin-top: 5px;
}

.scoreBox span:last-child {
  margin-left: 25px;
}

.newGameButton {
  height: 40px;
  padding: 0 15px;
  background-color: rgb(255, 255, 255);
  border: none;
  font-size: 25px;
  font-weight: 700;
  line-height: 40px;
  margin-left: 15px;
  white-space: nowrap;
}
.newGameButton:hover {
  cursor: pointer;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.dimsInput {
  background-color: rgb(24, 24, 24);
  color: white;
  width: 30px;
  height: 30px;
  border: 2px solid rgb(255, 255, 255);
  font-weight: 900;
  font-size: 20px;
  text-align: center;
  margin: 0 10px 0 5px;
}

.boardHolder {
  background-color: rgb(24, 24, 24);
  border-radius: 4px;
  padding: 3px 0;
}

@media (min-width: 768px) {
  .boardHolder {
    padding: 10px 0;
    border-radius: 7px;
  }
}

.footer {
  text-align: right;
  margin-top: 10px;
}
.footer a {
  color: rgb(133, 133, 133);
  text-decoration: none;
}
@media (max-height: 1000px) {
  .title {
    font-weight: 900;
    font-size: 50px;
    margin-top: 15px;
  }
  .menuContainer {
    font-size: 15px;
    margin-top: 15px;
    padding: 7px 5px;
  }
  .scoreBox {
    margin-top: 7px;
  }
}
</style>
