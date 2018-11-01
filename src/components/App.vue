<template>
	<div id="app">
		{{message}}
		<TermBox/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TermBox from './TermBox.vue';

@Component( {
	components: {
		TermBox,
	},
} )
export default class App extends Vue {
	public message = 'Hello world!';
}
</script>

<style lang="scss">
</style>
