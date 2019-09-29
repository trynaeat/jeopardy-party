<template>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   id="svg8"
   version="1.1"
   viewBox="0 0 200 50"
   width="100%">
  <defs
     id="defs2">
    <linearGradient
       id="linearGradient857">
      <stop
         id="stop853"
         offset="0"
         style="stop-color:#ffffff;stop-opacity:1;" />
      <stop
         id="stop855"
         offset="1"
         style="stop-color:#ffffff;stop-opacity:0;" />
    </linearGradient>
    <linearGradient
       id="linearGradient847">
      <stop
         id="stop843"
         offset="0"
         style="stop-color:#ffffff;stop-opacity:1;" />
      <stop
         id="stop845"
         offset="1"
         style="stop-color:#ffffff;stop-opacity:0;" />
    </linearGradient>
    <linearGradient
       gradientTransform="matrix(0.96887159,0,0,1.0263158,2.0075389,-7.0299891)"
       gradientUnits="userSpaceOnUse"
       y2="266.57294"
       x2="197.30357"
       y1="248.99702"
       x1="197.30357"
       id="linearGradient849"
       xlink:href="#linearGradient847" />
    <linearGradient
       gradientTransform="matrix(1,0,0,0.68421051,0,78.03384)"
       gradientUnits="userSpaceOnUse"
       y2="204.58482"
       x2="88.446434"
       y1="243.51637"
       x1="-6.8035712"
       id="linearGradient859"
       xlink:href="#linearGradient857" />
  </defs>
  <metadata
     id="metadata5">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     transform="translate(0,-247)"
     id="layer1">
     <!-- Main lamp -->
    <rect
       y="249.92715"
       x="1.6860669"
       height="46.142738"
       width="195.82133"
       id="rect12"
       :class="{ active: active, inactive: !active }"
       style="stroke:#999999;stroke-width:4.88403749;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    <rect
       rx="12.451152"
       ry="3.4913018"
       y="252.39882"
       x="5.6696424"
       height="14.741089"
       width="188.23216"
       id="rect841"
       style="fill:url(#linearGradient849);fill-opacity:1;stroke:none;stroke-width:5.27674484;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    <rect
       ry="2.0689094"
       rx="0"
       y="242.19345"
       x="-6.8035712"
       height="4.9136901"
       width="217.33632"
       id="rect851"
       style="fill:url(#linearGradient859);fill-opacity:1;stroke:none;stroke-width:4.37710857;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
  </g>
</svg>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TimerPiece',
  props: {
     active: Boolean,
  }
})
</script>

<style scoped lang="scss">
.active {
    fill: #FF0000;
}
.inactive {
    fill: #782121;
}
rect {
    transition: fill .4s ease;
}
</style>