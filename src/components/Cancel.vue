<template>
	<div class="wb-ui-cancel">
		<a
			class="wb-ui-cancel__link"
			href="#"
			:title="message( MESSAGE_KEYS.CANCEL )"
			@click.prevent="$emit( 'cancel' )"
		>
			<span class="wb-ui-publish__text">{{ message( MESSAGE_KEYS.CANCEL ) }}</span>
		</a>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Messages from './mixins/Messages';

@Component( {
} )
export default class Cancel extends mixins( Messages ) {
}
</script>

<style lang="scss">
.wb-ui-cancel {
	&__link {
		background: $svg-cancel center/26px no-repeat;
		width: 48px;
		height: 48px;
		display: block;

		[ dir='rtl' ] & {
			transform: scaleX( -1 );
		}
	}

	&__text {
		@include sr-only();
	}
}
</style>
