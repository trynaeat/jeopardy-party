<template>
<div class="flex menu">
  <button type="button" class="btn btn-primary menu-btn" @click="menuOpen = !menuOpen;">
    <img src="../images/hamburger.svg" alt="Hamburger Menu">
  </button>
  <div class="base-margin-left" v-if="menuOpen">
    <button type="button" class="btn btn-primary" data-toggle="modal" @click="showModal = true;">Edit Signature</button>
  </div>
  <Modal :show.sync="showModal">
      <h5 slot="modal-header" class="modal-title">Sign your name (optional)</h5>
      <div slot="modal-body" class="text-center">
        <SignName ref="signName"></SignName>
      </div>
      <button slot="modal-footer" type="button" class="btn btn-primary" @click="saveSig()">Save</button>
  </Modal>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Modal from './common/Modal.vue';
import SignName from './SignName.vue';

export default Vue.extend({
  name: 'PlayerMenu',
  components: {
      Modal,
      SignName,
  },
  data() {
    return {
      showModal: false,
      menuOpen: false,
    };
  },
  mounted() {
    this.showModal = true; // Prompt for signature when user first navigates
  },
  methods: {
    saveSig() {
      (<any>this.$refs.signName).submit();
      this.showModal = false;
    },
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
.menu {
  position: fixed;
  top: 10px;
  left: 10px;
}
.menu-btn {
    font-size: 8px;
}
</style>
