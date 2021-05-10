<script>
import b from "../helpers/boardProcessing";
import NumberCell from "./NumberCell";

export default {
  props: {
    board: Object,
    x: Number,
    y: Number,
    boardWidth: Number,
    boardHeight: Number,
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
      horizontalpadding: 0,
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
        this.cellSize = (this.boardWidth * 0.93) / dims.x;
        this.cellMargin = (this.boardWidth * 0.07) / (dims.x * 2);
        this.horizontalpadding = 0;
      } else {
        this.cellSize = (this.boardHeight * 0.93) / dims.y;
        this.cellMargin = (this.boardHeight * 0.07) / (dims.y * 2);
        this.horizontalpadding =
          (dims.y - dims.x) * (this.cellSize + this.cellMargin * 2);
      }
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
        width: `${boardWidth - horizontalpadding}px`,
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

    <div
      class="gridContainer abs"
      :style="{
        width: `${boardWidth - horizontalpadding}px`,
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
