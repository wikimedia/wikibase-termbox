<template>
	<div class="wb-ui-modal">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'Modal',
} );
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
