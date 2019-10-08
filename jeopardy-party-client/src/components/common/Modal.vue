<template>
  <div>
    <transition name="fade">
      <div class="modal-backdrop"
          v-if="show"
          :class="{ show: show }"
          style="display: block;">
      </div>
    </transition>
    <transition name="slide">
      <div class="modal"
        :class="{ show: show }"
        style="display: block;"
        id="exampleModal"
        tabindex="-1" 
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        v-if="show">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <slot name="modal-header"></slot>
              <button v-if="closeButton" type="button" class="close" aria-label="Close" @click="onClose()">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <slot name="modal-body"></slot>
            </div>
            <div class="modal-footer" v-if="$slots['modal-footer']">
              <slot name="modal-footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Modal',
  props: {
      show: Boolean,
      closeButton: {
        type: Boolean,
        default: true,
      },
  },
  methods: {
      onClose() {
          this.$emit('update:show', false);
      },
  }
});
</script>

<style scoped lang="scss">
div.modal {
    color: black;
    text-shadow: none;
}
button.close {
    font-family: initial;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.slide-enter-active, .slide-leave-active {
  transition: all 0.15s;
}
.slide-enter, .slide-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}
</style>
