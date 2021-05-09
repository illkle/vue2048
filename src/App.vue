<template>
  <h1>2048</h1>
  <BoardView :board="board" />
  <div v-if="loser">HAHA LOSER!!!!!!!))))))))</div>
</template>

<script>
import BoardView from "./components/BoardView";
import BoardProcess from "./helpers/boardProcessing";

export default {
  name: "App",
  components: {
    BoardView,
  },
  data() {
    return {
      board: [],
    };
  },
  computed: {
    loser() {
      if (this.board.length < 2) {
        return false;
      }
      return BoardProcess.loseCheck(this.board);
    },
  },
  methods: {
    initBoard(x, y) {
      this.board = BoardProcess.initBoard(x, y);
      this.addTwoToRandomPlace();
      this.addTwoToRandomPlace();
    },
    addTwoToRandomPlace() {
      this.board = BoardProcess.addTwoToRandomPlace(this.board);
    },
    handlePressedButton(button) {
      switch (button) {
        case "ArrowUp":
          this.board = BoardProcess.moveUp(this.board);
          break;
        case "ArrowDown":
          this.board = BoardProcess.moveDown(this.board);
          break;
        case "ArrowLeft":
          this.board = BoardProcess.moveLeft(this.board);
          break;
        case "ArrowRight":
          this.board = BoardProcess.moveRight(this.board);
          break;
      }
      this.addTwoToRandomPlace();
    },
  },
  mounted() {
    this.initBoard(4, 4);
  },
  created() {
    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        this.handlePressedButton(e.key);
      }
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
