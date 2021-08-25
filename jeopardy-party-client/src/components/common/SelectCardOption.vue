<template>
  <div class="base-margin">
	  <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SelectCardOption',
  props: {
	  value: {
		  type: [Array, Object, String, Number],
		  default: () => null,
	  },
  },
});
</script>
