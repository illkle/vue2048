<template>
  <div class="board">
    <div :style="GridStyle" class="wrapper">
      <template v-for="line in board" :key="line.index">
        <div
          :class="cssClassFromNumber(item)"
          class="gridItem"
          v-for="item in line"
          :key="item.index"
        >
          <template v-if="item !== EMPTY_CELL">{{ item }}</template>
        </div>
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
  methods: {
    cssClassFromNumber(number) {
      console.log("ASDasd");
      const classes = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
      ];
      let position = Math.log2(number);
      if (position > classes.length) {
        return classes[classes.length - 1];
      } else {
        return classes[position - 1];
      }
    },
  },
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 40px;
  color: black;
  border: 2px solid black;
  border-radius: 4px;
  background-color: wheat;
}
</style>
