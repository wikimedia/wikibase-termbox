<template>
	<a
		class="wb-ui-event-emitting-button"
		:class="`wb-ui-event-emitting-button--${type}`"
		:title="message"
		:href="href"
		@click.prevent="$emit( 'click' )"
	>
		<span class="wb-ui-event-emitting-button__text">{{ message }}</span>
	</a>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class EventEmittingButton extends Vue {
	@Prop( {
		required: true,
		validator: ( type ) => [ 'edit', 'publish', 'cancel' ].indexOf( type ) !== -1,
	} )
	public type!: String;

	@Prop( { required: true, type: String } )
	public message!: String;

	@Prop( { required: false, default: '#', type: String } )
	public href!: String;
}
</script>

<style lang="scss">
.wb-ui-event-emitting-button {
	background-position: center;
	background-size: 26px;
	background-repeat: no-repeat;
	width: 48px;
	height: 48px;
	display: block;

	[ dir='rtl' ] & {
		transform: scaleX( -1 );
	}

	&__text {
		@include sr-only();
	}

	&--edit {
		background-image: $svg-pen;
	}

	&--publish {
		background-image: $svg-publish;

		&:hover {
			filter: saturate( 55.6% ) contrast( 144.5% ) brightness( 144.5% );
			transition: filter 0.3s ease;
		}

		&:active {
			filter: saturate( 142% ) contrast( 67% ) brightness( 67% );
			transition: filter 0.5s ease;
		}
	}

	&--cancel {
		background-image: $svg-cancel;
	}
}
</style>
