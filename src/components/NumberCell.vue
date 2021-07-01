<template>
  <div
    class="gridCell"
    :style="{
      backgroundColor: `hsl(${60 - Math.log2(tweenedNumber) * 5}, 100%, 50%)`,
      left: `${tweenedX * cellWithMargin}px`,
      top: `${tweenedY * cellWithMargin}px`,
      width: `${dimensions}px`,
      height: `${dimensions}px`,
      zIndex: number,
      margin: `${gridGap}px`,
      fontSize: `${dimensions / 4}px`,
      transform: `scale(${size}, ${size})`,
    }"
  >
    {{ Math.round(tweenedNumber) }}
  </div>
</template>

<script>
import gsap from "gsap";

export default {
  data() {
    return {
      tweenedNumber: 2,
      tweenedX: 0,
      tweenedY: 0,
      size: 0,
      sizeTo: 0,
      animations: true,
    };
  },
  props: {
    number: {
      type: Number,
      default: 0,
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    dimensions: {
      type: Number,
      default: 0,
    },
    gridGap: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    cellWithMargin() {
      return this.dimensions + this.gridGap * 2;
    },
  },
  watch: {
    number(newValue) {
      if (this.animations) {
        gsap.to(this.$data, { duration: 0.15, tweenedNumber: newValue });
      } else {
        this.tweenedNumber = newValue;
      }
    },
    x(newValue) {
      if (this.animations) {
        gsap.to(this.$data, {
          duration: 0.15,
          tweenedX: newValue,
          ease: "power2.inOut",
        });
      } else {
        this.tweenedX = newValue;
      }
    },
    y(newValue) {
      if (this.animations) {
        gsap.to(this.$data, {
          duration: 0.15,
          tweenedY: newValue,
          ease: "power2.inOut",
        });
      } else {
        this.tweenedY = newValue;
      }
    },
    sizeTo(newValue) {
      if (this.animations) {
        gsap.to(this.$data, {
          duration: 0.25,
          size: newValue,
          ease: "power4.out",
        });
      } else {
        this.size = newValue;
      }
    },
  },
  mounted() {
    this.tweenedNumber = this.number;
    this.tweenedX = this.x;
    this.tweenedY = this.y;
    this.sizeTo = 1;
  },
};
</script>

<style scoped>
</style>
