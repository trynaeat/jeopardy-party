<template>
<svg class="draw-area"
    ref="svgArea"
    @mousedown="clickStart($event)"
    @mouseup="clickEnd($event)"
    @mousemove="onMove($event)"
    @touchmove="onTouch($event)">
    <path :d="path"></path>
</svg>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SignName',
  data() {
      return {
          pt: null as SVGPoint | null, // reference point for converting global mouse position to svg area pos
          path: '', // Dynamically drawn path
      };
  },
  mounted() {
      this.pt = (<any>this.$refs.svgArea).createSVGPoint();
  },
  methods: {
    cursorPoint(evt: MouseEvent | Touch) {
        if (!this.pt) return { x: 0, y: 0 };
        this.pt.x = evt.clientX;
        this.pt.y = evt.clientY;
        return this.pt.matrixTransform((<any>this.$refs.svgArea).getScreenCTM().inverse());
    },
    drawPoint(p: { x: number, y: number }) {
        // On first touch, move the cursor to where they started
        if (this.path === '') {
            this.path = `M${p.x} ${p.y}`
        }
        this.path += `L${p.x} ${p.y}`;
    },
    clickStart() {

    },
    clickEnd() {

    },
    onMove(evt: MouseEvent) {
        const loc = this.cursorPoint(evt);
        this.drawPoint(loc);
    },
    onTouch(evt: TouchEvent) {
        const loc = this.cursorPoint(evt.changedTouches[0]);
        this.drawPoint(loc);
    }
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
.draw-area {
    height: 400px;
    width: 300px;
    background-color: $bg-color;
    display: inline-block;
}
path {
  fill: none;
  stroke: white;
  stroke-width: 3px;
}
</style>
