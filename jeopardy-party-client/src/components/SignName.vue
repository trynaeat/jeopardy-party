<template>
<div>
    <svg class="draw-area"
        ref="svgArea"
        @mousedown="clickStart($event)"
        @mouseup="clickEnd($event)"
        @touchstart="touchStart($event)"
        @touchend="touchEnd($event)"
        @mousemove="onMove($event)"
        @touchmove="onTouch($event)">
        <foreignObject x=20 y=20 width="25px" height="23px">
            <button type="button" class="erase" aria-label="Close" @click="erase()">
                <span aria-hidden="true">&times;</span>
            </button>
        </foreignObject>
        <path v-for="(path, index) in paths" :key="index" :d="path"></path>
    </svg>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SignName',
  data() {
      return {
          pt: null as SVGPoint | null, // reference point for converting global mouse position to svg area pos
          paths: [] as string[], // Dynamically drawn paths
          mousedown: false, // Whether the mouse/finger is down and drawing currently
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
    newPath(p: {x: number, y: number }) {
        // On first touch, move the cursor to where they started
        this.paths.push(`M${p.x} ${p.y}`);
        this.drawPoint(p);
    },
    drawPoint(p: { x: number, y: number }) {
        // Active path is the last added one
        this.paths[this.paths.length - 1] += `L${p.x} ${p.y}`;
        this.paths = this.paths.slice(0); // fire change detection
    },
    clickStart(evt: MouseEvent) {
        this.mousedown = true;
        const loc = this.cursorPoint(evt);
        this.newPath(loc);
    },
    clickEnd() {
        this.mousedown = false;
    },
    touchStart(evt: TouchEvent) {
        this.mousedown = true;
        const loc = this.cursorPoint(evt.changedTouches[0]);
        this.newPath(loc);
    },
    touchEnd(evt: TouchEvent) {
        this.mousedown = false;
    },
    onMove(evt: MouseEvent) {
        if (!this.mousedown) return;
        const loc = this.cursorPoint(evt);
        this.drawPoint(loc);
    },
    onTouch(evt: TouchEvent) {
        if (!this.mousedown) return;
        const loc = this.cursorPoint(evt.changedTouches[0]);
        this.drawPoint(loc);
    },
    erase () {
        this.paths = [];
    }
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
.draw-area {
    height: 400px;
    width: 310px;
    background-color: $bg-color;
    display: inline-block;
}
path {
  fill: none;
  stroke: white;
  stroke-width: 3px;
}
button.erase {
    font: initial;
    fill: white;
}
</style>
