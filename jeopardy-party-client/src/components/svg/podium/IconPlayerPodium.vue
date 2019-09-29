<template>
<svg xmlns="http://www.w3.org/2000/svg" 
    :width="width"
    :height="height"
    viewBox="0 0 210 297"
    role="presentation"
    preserveAspectRatio="none"
  >
<defs
     id="defs2">
    <linearGradient
       id="linearGradient4596">
      <stop
         id="stop4592"
         offset="0"
         style="stop-color:#1e4b84;stop-opacity:1;" />
      <stop
         id="stop4594"
         offset="1"
         style="stop-color:#2c7784;stop-opacity:0" />
    </linearGradient>
    <radialGradient
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(2.255663,0.01337874,-0.00956232,1.6122103,-131.45063,-94.066731)"
       r="96.597786"
       fy="151.3381"
       fx="105.83873"
       cy="151.3381"
       cx="105.83873"
       id="radialGradient4600"
       xlink:href="#linearGradient4596" />
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
     id="layer1">
     <foreignObject
         y="0"
         x="1.1894256"
         width="100%"
         height="100%"
         >
         <div xmlns="http://www.w3.org/1999/xhtml">
            <Timer :playerName="player.username" :playerOnly="true"></Timer>
         </div>
     </foreignObject>
    <rect
       y="72.596466"
       x="11.328194"
       height="157.48328"
       width="189.02107"
       id="rect4588"
       style="fill:url(#radialGradient4600);fill-opacity:1;stroke:#6c5d53;stroke-width:4.17449713;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/>
   <text class="winnings" x="50%" y="45" dominant-baseline="middle" text-anchor="middle">${{ player.winnings || 0 }}</text>
   <foreignObject x="0" y="72.6" width="100%" height="157.5" dominant-baseline="middle" text-anchor="middle">
      <div class="name-container">
         <span class="player-name">{{ player.username }}</span>
      </div>
   </foreignObject>
  </g>
</svg>
</template>

<script lang="ts">
import Vue from 'vue';
import Timer from '../../Timer.vue';

export default Vue.extend({
  name: 'IconPlayerPodium',
  components: {
     Timer,
  },
  props: {
     height: String,
     width: String,
     player: {
       type: Object,
       default () {
          return { };
       }, 
     },
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/variables.scss';
.player-name {
   fill: white;
   font-size: 30px;
   overflow-wrap: break-word;
   overflow: hidden;
   text-overflow: ellipsis;
}
.winnings {
   fill: white;
   font-size: 30px;
}
.name-container {
   display:flex;
   height: 100%;
   flex-direction:column;
   justify-content:center;
}
</style>