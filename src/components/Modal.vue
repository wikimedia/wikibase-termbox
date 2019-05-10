<template>
	<div class="wb-ui-modal">
		<div class="wb-ui-modal__content">
			<slot />
		</div>
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
	z-index: 999;
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba( 0, 0, 0, 0.25 );

	&__content {
		font-family: $font-family-sans;
		margin: 0 auto;
		width: 100%;
		max-width: 375px;
		padding: 16px;
		background: #fff;
		box-shadow: 0 4px 6px rgba( 0, 0, 0, 0.25 );
	}
}
</style>
