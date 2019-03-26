<template>
	<div class="wb-ui-publish">
		<a
			class="wb-ui-publish__link"
			href="#"
			:title="message( MESSAGE_KEYS.PUBLISH )"
			@click.prevent="$emit( 'publish' )"
		>
			<span class="wb-ui-publish__text">{{ message( MESSAGE_KEYS.PUBLISH ) }}</span>
		</a>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Messages from './mixins/Messages';

@Component( {
} )
export default class Publish extends mixins( Messages ) {
}
</script>

<style lang="scss">
.wb-ui-publish {
	&__link {
		background: $svg-publish 50% 50% no-repeat;
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
