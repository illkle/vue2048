<template>
  <div class="board">
    <div :style="GridStyle" class="wrapper">
      <template v-for="line in board" :key="line.index">
        <template v-for="item in line" :key="item.index">
          <div class="gridItem">
            <div
              class="cell"
              :style="{
                backgroundColor: Number.isNaN(Number(item))
                  ? 'white'
                  : `hsl(${55 - Math.log2(item) * 4}, 100%, 50%)`,
              }"
              v-if="item !== EMPTY_CELL"
            >
              {{ item }}
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import b from "../helpers/boardProcessing";

export default {
  props: {
    board: {
      type: Array,
      default: () => [
        [0, 0],
        [0, 0],
      ],
    },
  },
  data() {
    return {
      EMPTY_CELL: b.EMPTY_CELL,
    };
  },
  computed: {
    GridStyle() {
      if (Object.is(this.board[0], undefined)) {
        return "";
      }

      return {
        "grid-template-rows": `repeat(${this.board.length}, 75px)`,
        "grid-template-columns": `repeat(${this.board[0].length}, 75px)`,
      };
    },
  },
  methods: {},
};
</script>

<style scoped>
.board {
  display: flex;
  justify-content: center;
}

.wrapper {
  display: grid;
  grid-gap: 10px;
}
.gridItem {
  font-size: 30px;
  color: white;

  border-radius: 6%;
  background-color: rgb(224, 216, 194);
}
.cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  border-radius: 6%;
}
</style>
