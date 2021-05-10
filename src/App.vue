<script>
import BoardView from "./components/BoardView";
import boardProcessing from "./helpers/boardProcessing";

export default {
  name: "App",
  components: {
    BoardView,
  },
  data() {
    return {
      board: [],
      won: false,
      x: 4,
      y: 4,
      window: {
        width: 0,
        height: 0,
      },
    };
  },
  computed: {
    boardSize() {
      const calculated = Math.min(this.window.width, this.window.height) * 0.9;
      return calculated > 500 ? 500 : calculated;
    },
    loser() {
      if (this.board.length < 2) {
        return false;
      }
      return boardProcessing.loseCheck(this.board);
    },
    score() {
      if (this.board.length < 2) {
        return 0;
      }
      return boardProcessing.countBoardSum(this.board);
    },
  },
  methods: {
    initBoard() {
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
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.initBoard();
  },
  created() {
    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        this.handlePressedButton(e.key);
      }
    });
  },
  watch: {
    board(newBoard) {
      if (this.won === true || newBoard.field.length < 2) {
        return;
      }

      const result = boardProcessing.winCheck(newBoard);

      if (result === true) {
        this.won = true;
      }
    },
  },
};
</script>

<template>
  <div class="container" :style="{ width: `${boardSize + 25}px` }">
    <h1 class="title">2048</h1>
    <div class="menuContainer">
      <div class="scoreBox"><span>Score:</span> {{ score }}</div>
      <div class="newBox">
        X
        <input class="dimsInput" type="number" max="20" v-model.number="x" />
        Y
        <input class="dimsInput" type="number" max="20" v-model.number="y" />
        <button class="newGameButton" @click="initBoard()">START</button>
      </div>
    </div>
    <div class="boardHolder">
      <BoardView
        v-if="this.board.field"
        :board="board"
        :boardWidth="boardSize"
        :boardHeight="boardSize"
      />
    </div>
    <div v-if="loser">HAHA LOSER!!!!!!!))))))))</div>
    <div v-if="won">U WON BRUH</div>
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
#app {
  font-family: "Roboto Mono", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.container {
  margin: 0 auto;
}

.menuContainer {
  display: flex;
  font-weight: 700;
  font-size: 25px;
  justify-content: space-between;
  border-radius: 6px;
  padding: 5px;

  background-color: rgb(24, 24, 24);
}

.scoreBox,
.newBox {
  color: white;
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
}

.scoreBox span {
  font-weight: 500;
}

.newGameButton {
  height: 80%;
  padding: 0 15px;
  background-color: rgb(255, 255, 255);
  border: none;
  font-size: 25px;
  font-weight: 700;
  margin-left: 15px;
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

.title {
  font-weight: 900;
  font-size: 150px;
}
.boardHolder {
  background-color: rgb(24, 24, 24);
  border-radius: 7px;
  padding: 10px 0;
  margin-top: 25px;
}

.footer {
  margin-top: 100px;
}
.footer a {
  color: rgb(133, 133, 133);
  text-decoration: none;
}
</style>
