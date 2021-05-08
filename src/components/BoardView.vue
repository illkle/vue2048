<template>
  <div class="outerCont">
    <div class="gridContainer">
      <template :key="line.index" v-for="line in board">
        <template :key="item.id" v-for="item in line">
          <div class="gridEmpty"></div>
        </template>
      </template>
    </div>

    <div class="gridContainerTop">
      <div
        v-for="cell in cells"
        :key="cell.id"
        class="gridCell"
        :style="{ left: `${cell.x * 85}px`, top: `${cell.y * 85}px` }"
      ></div>
      <template v-for="(line, lineindex) in board" :key="line.index">
        <template v-for="(item, itemindex) in line" :key="item.id">
          <div
            class="gridCell"
            :style="{
              backgroundColor: Number.isNaN(Number(item.val))
                ? 'white'
                : `hsl(${55 - Math.log2(item.val) * 4}, 100%, 50%)`,
              left: `${itemindex * 85}px`,
              top: `${lineindex * 85}px`,
            }"
            v-if="item.val !== EMPTY_CELL"
          >
            {{ item.val }}
          </div>
        </template>
      </template>
    </div>
  </div>

  <div :style="GridStyle" class="wrapper"></div>
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
  width: 340px;
  display: flex;
  flex-wrap: wrap;
}

.gridContainerTop {
  width: 340px;
  display: flex;
  flex-wrap: wrap;
  position: absolute;
}

.gridEmpty,
.gridCell {
  margin: 5px;
  width: 75px;
  height: 75px;
  justify-content: center;
  align-items: center;
  display: flex;
  border-radius: 6%;
}

.gridEmpty {
  font-size: 30px;
  color: white;
  background-color: rgb(224, 216, 194);
}

.gridCell {
  font-size: 20px;
  color: white;
  position: absolute;
  transition: 0.2s;
}
</style>
