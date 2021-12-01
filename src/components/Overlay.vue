<template>
	<div class="wb-ui-overlay">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'Overlay',
} );
</script>

<style lang="scss">
.wb-ui-overlay {
	z-index: 999;
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba( 255, 255, 255, 0.5 );
}
</style>
