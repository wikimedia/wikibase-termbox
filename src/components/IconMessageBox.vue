<template>
	<div class="wb-ui-icon-message-box" :class="`wb-ui-icon-message-box--${type}`">
		<div class="wb-ui-icon-message-box__content">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const validTypes = [ 'warning', 'error' ];

export default defineComponent( {
	name: 'IconMessageBox',
	props: {
		type: {
			required: true,
			validator: ( type: string ) => validTypes.indexOf( type ) !== -1,
		},
	},
} );
</script>

<style lang="scss">
.wb-ui-icon-message-box {
	border: 1px solid;
	padding: 8px 8px 8px 48px;
	margin: 16px -8px 0 -8px;
	line-height: 1.2;
	box-sizing: border-box;
	text-align: left;

	&--error {
		border-color: $error-message-border;
		background: $error-message-background $svg-error no-repeat 16px 8px;
	}

	&--warning {
		border-color: $warning-message-border;
		background: $warning-message-background $svg-warning no-repeat 16px 8px;
	}
}
</style>
