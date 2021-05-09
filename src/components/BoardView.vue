<template>
  <div class="outerCont">
    <div class="gridContainer" :style="{ width: `${boardWidth}px` }">
      <template :key="line.index" v-for="line in board.field">
        <template :key="item.id" v-for="item in line">
          <div
            class="gridEmpty"
            :style="{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              margin: `${gridGap}px`,
            }"
          ></div>
        </template>
      </template>
    </div>

    <div class="gridContainer abs" :style="{ width: `${boardWidth}px` }">
      <NumberCell
        v-for="item in GridCellsWithPos"
        :key="item.id"
        :number="Number(item.val)"
        :x="item.x"
        :y="item.y"
        :dimensions="cellSize"
        :gridGap="gridGap"
      />
    </div>
  </div>
</template>

<script>
import b from "../helpers/boardProcessing";
import NumberCell from "./NumberCell";

export default {
  props: {
    board: {
      type: Object,
      default: () => {
        // eslint-disable-next-line no-unused-labels
        field: [
          [0, 0],
          [0, 0],
        ];
      },
    },
  },
  components: {
    NumberCell,
  },
  data() {
    return {
      EMPTY_CELL: b.EMPTY_CELL,
      cellSize: 75,
      gridGap: 2.5,
    };
  },
  computed: {
    GridCellsWithPos() {
      if (!this.board.field) {
        return;
      }
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
    boardWidth() {
      if (!this.board.field) {
        return 0;
      }
      return (this.cellSize + this.gridGap * 2) * this.board.field[0].length;
    },
  },
  methods: {},
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: "Roboto";
}
.outerCont {
  display: flex;
  justify-content: center;
  margin-top: 150px;
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
  font-size: 20px;
  color: rgb(20, 20, 20);
  position: absolute;
}
</style>
