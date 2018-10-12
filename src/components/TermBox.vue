<template>
  <div class="termbox-placeholder">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class TermBox extends Vue {
}
</script>

<style lang="scss">
.termbox-placeholder {
    background: #ccc;
    width: 100%;
    height: 100px;
}
</style>
