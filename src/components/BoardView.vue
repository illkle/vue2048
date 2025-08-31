<script>
import b from "../helpers/boardProcessing";
import NumberCell from "./NumberCell.vue";

export default {
  props: {
    board: Object,
    x: Number,
    y: Number,
    boardWidth: Number,
    boardHeight: Number,
    lost: Boolean,
  },
  components: {
    NumberCell,
  },
  data() {
    return {
      EMPTY_CELL: b.EMPTY_CELL,
      gridGap: 2.5,
      cellSize: 0,
      cellMargin: 0,
    };
  },
  computed: {
    boardDimensions() {
      return { x: this.board.field[0].length, y: this.board.field.length };
    },
    GridCellsWithPos() {
      const parsePos = (input) => {
        const withPositions = [];
        for (const [lineIndex, line] of input.entries()) {
          for (const [itemIndex, item] of line.entries()) {
            if (item.val !== b.EMPTY_CELL) {
              withPositions.push({
                ...item,
                x: itemIndex,
                y: lineIndex,
              });
            }
          }
        }
        return withPositions;
      };

      let withPos = parsePos(this.board.field);

      if (this.board.remainder) {
        const extra = parsePos(this.board.remainder);
        withPos = withPos.concat(extra);
      }

      return withPos;
    },
  },
  methods: {
    calculateDimensions() {
      const dims = this.boardDimensions;
      if (dims.x >= dims.y) {
        this.cellSize = (this.boardWidth * 0.94) / dims.x;
        this.cellMargin = (this.boardWidth * 0.06) / (dims.x * 2);
      } else {
        this.cellSize = (this.boardHeight * 0.94) / dims.y;
        this.cellMargin = (this.boardHeight * 0.06) / (dims.y * 2);
      }
    },
    restartGame() {
      this.$emit("restartGame");
    },
  },
  watch: {
    boardDimensions: {
      immediate: true,
      handler() {
        this.calculateDimensions();
      },
    },
    boardWidth: {
      immediate: true,
      handler() {
        this.calculateDimensions();
      },
    },
    boardHeight: {
      immediate: true,
      handler() {
        this.calculateDimensions();
      },
    },
  },
};
</script>

<template>
  <div class="outerCont">
    <div
      class="gridContainer"
      :style="{
        width: `${boardWidth}px`,
      }"
    >
      <template :key="line.index" v-for="line in board.field">
        <template :key="item.id" v-for="item in line">
          <div
            class="gridEmpty"
            :style="{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              margin: `${cellMargin}px`,
            }"
          ></div>
        </template>
      </template>
    </div>
    <transition name="fade">
      <div
        v-if="lost"
        class="gridContainer abs lost"
        :style="{
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
        }"
      >
        <p>You lost :(</p>
        <button @click="restartGame()">RESTART</button>
      </div>
    </transition>
    <div
      class="gridContainer abs"
      :style="{
        width: `${boardWidth}px`,
      }"
    >
      <NumberCell
        v-for="item in GridCellsWithPos"
        :key="item.id"
        :number="Number(item.val)"
        :x="item.x"
        :y="item.y"
        :dimensions="cellSize"
        :gridGap="cellMargin"
      />
    </div>
  </div>
</template>

<style scoped>
.outerCont {
  display: flex;
  justify-content: center;
}
.gridContainer {
  display: flex;
  flex-wrap: wrap;
}

.lost {
  background-color: rgba(0, 0, 0, 0.685);
  z-index: 10000;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  transition: all 1s;
}

.lost button {
  display: flex;
  width: 150px;
  margin-top: 25px;
  padding: 15px 25px;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  background-color: white;
  border: none;
  border-radius: 5px;
  font-weight: 700;
}

.fade-enter-active {
  transition: opacity 0.25s ease-out;
}
.fade-leave-active {
  transition: opacity 0.1s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.debug {
  position: absolute;
}

.abs {
  position: absolute;
}

.gridEmpty,
.gridCell {
  justify-content: center;
  align-items: center;
  display: flex;
  border-radius: 6%;
}

.gridEmpty {
  color: white;
  background-color: rgb(224, 216, 194);
}

.gridCell {
  color: rgb(22, 24, 26);
  font-weight: 700;
  position: absolute;
}
</style>
