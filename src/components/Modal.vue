<template>
	<div class="wb-ui-modal">
		<slot />
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Modal extends Vue {
}
</script>

<style lang="scss">
.wb-ui-modal {
	font-family: $font-family-sans;
	margin: 0 auto;
	max-width: 375px;
	padding: 16px;
	background: #fff;
	box-shadow: 0 4px 6px rgba( 0, 0, 0, 0.25 );
}
</style>
