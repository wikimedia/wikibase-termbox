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
		background: $svg-publish center/26px no-repeat;
		width: 48px;
		height: 48px;
		display: block;

		[ dir='rtl' ] & {
			transform: scaleX( -1 );
		}

		&:hover {
			filter: saturate( 55.6% )
				contrast( 144.5% )
				brightness( 144.5% );
			transition: filter 0.3s ease;
		}

		&:active {
			filter: saturate( 142% )
				contrast( 67% )
				brightness( 67% );
			transition: filter 0.5s ease;
		}
	}

	&__text {
		@include sr-only();
	}
}
</style>
