<template>
  <div id="app">
    {{message}}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class App extends Vue {
  public message = 'Hello world!';
}
</script>

<style lang="scss">
</style>
