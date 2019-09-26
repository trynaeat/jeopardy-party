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
    <rect
       y="14.329304"
       x="1.1894256"
       height="280.72531"
       width="209.28783"
       id="rect10"
       style="fill:#071484;fill-opacity:1;stroke:#000000;stroke-width:4.64670658;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    <rect
       y="1.2545795"
       x="0.43507814"
       height="11.118606"
       width="28.565788"
       id="rect4550"
       style="fill:#5c0000;fill-opacity:1;stroke:#6c5d53;stroke-width:2.71341753;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    <use
       height="100%"
       width="100%"
       id="use4572"
       transform="translate(22.532762)"
       xlink:href="#rect4550"
       y="0"
       x="0" />
    <use
       height="100%"
       width="100%"
       id="use4574"
       transform="translate(45.065525)"
       xlink:href="#rect4550"
       y="0"
       x="0" />
    <use
       height="100%"
       width="100%"
       id="use4576"
       transform="translate(67.598288)"
       xlink:href="#rect4550"
       y="0"
       x="0" />
    <use
       height="100%"
       width="100%"
       id="use4578"
       transform="translate(90.131051)"
       xlink:href="#rect4550"
       y="0"
       x="0" />
    <use
       height="100%"
       width="100%"
       id="use4580"
       transform="translate(112.66381)"
       xlink:href="#rect4550"
       y="0"
       x="0" />
    <use
       height="100%"
       width="100%"
       id="use4582"
       transform="translate(135.19658)"
       xlink:href="#rect4550"
       y="0"
       x="0" />
    <use
       height="100%"
       width="100%"
       id="use4584"
       transform="translate(157.72934)"
       xlink:href="#rect4550"
       y="0"
       x="0" />
    <use
       height="100%"
       width="100%"
       id="use4586"
       transform="translate(180.2621)"
       xlink:href="#rect4550"
       y="0"
       x="0" />
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

export default Vue.extend({
  name: 'IconPlayerPodium',
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