<template>
	<a
		class="wb-ui-event-emitting-button"
		:class="`wb-ui-event-emitting-button--${type}`"
		:href="href"
		:title="message"
		@click="click"
	>
		<span
			class="wb-ui-event-emitting-button__text"
		>{{ message }}</span>
	</a>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

const validTypes = [
	'normal',
	'primaryProgressive',
	'framelessProgressive',
	'edit',
	'publish',
	'cancel',
];
@Component
export default class EventEmittingButton extends Vue {
	@Prop( {
		required: true,
		validator: ( type ) => validTypes.indexOf( type ) !== -1,
	} )
	public type!: string;

	@Prop( { required: true, type: String } )
	public message!: string;

	@Prop( { required: false, default: '#', type: String } )
	public href!: string;

	@Prop( { required: false, default: true, type: Boolean } )
	public preventDefault!: boolean;

	public click( event: MouseEvent ) {
		if ( this.preventDefault ) {
			event.preventDefault();
		}
		this.$emit( 'click', event );
	}
}

</script>

<style lang="scss">
$block: '.wb-ui-event-emitting-button';

%iconOnlyButton {
	background-position: center;
	background-size: 26px;
	background-repeat: no-repeat;
	width: 48px;
	height: 48px;
	display: block;

	@at-root html[ dir='rtl' ] & { // references dir attribute of the App component
		transform: scaleX( -1 );
	}

	#{$block}__text {
		@include sr-only();
	}
}

%textButton {
	font-family: $font-family-sans;
	display: inline-block;
	cursor: pointer;
	white-space: nowrap;
	text-decoration: none;
	font-weight: bold;
}

%framed {
	border-width: 1px;
	border-radius: 2px;
	border-style: solid;
	box-sizing: border-box;
	padding: $padding-vertical-base $padding-horizontal-base;
}

#{$block} {
	transition: background-color 100ms, color 100ms, border-color 100ms, box-shadow 100ms, filter 100ms;

	&--edit {
		@extend %iconOnlyButton;
		background-image: $svg-pen;
	}

	&--publish {
		@extend %iconOnlyButton;
		background-image: $svg-publish;

		&:hover {
			filter: saturate( 55.6% ) contrast( 144.5% ) brightness( 144.5% );
		}

		&:active {
			filter: saturate( 142% ) contrast( 67% ) brightness( 67% );
		}
	}

	&--cancel {
		@extend %iconOnlyButton;
		background-image: $svg-cancel;
	}

	&--normal {
		@extend %textButton;
		@extend %framed;
		background-color: $color-normal;
		color: $font-color-normal;
		border-color: $border-color-normal;

		&:hover {
			background-color: $color-normal--hover;
			color: $font-color-normal--hover;
			border-color: $border-color-normal--hover;
		}

		&:active {
			background-color: $color-normal--active;
			color: $font-color-normal--active;
			border-color: $border-color-normal--active;
		}

		&:focus {
			box-shadow: inset 0 0 0 1px $box-shadow-color-normal--focus;
		}
	}

	&--primaryProgressive {
		@extend %textButton;
		@extend %framed;
		background-color: $color-primaryProgressive;
		color: $font-color-primaryProgressive;
		border-color: $border-color-primaryProgressive;

		&:hover {
			background-color: $color-primaryProgressive--hover;
			color: $font-color-primaryProgressive--hover;
			border-color: $border-color-primaryProgressive--hover;
		}

		&:active {
			background-color: $color-primaryProgressive--active;
			color: $font-color-primaryProgressive--active;
			border-color: $border-color-primaryProgressive--active;
		}

		&:focus {
			$box-shadow-1-primaryProgressive: inset 0 0 0 1px $box-shadow-color-1-primaryProgressive--focus;
			$box-shadow-2-primaryProgressive: inset 0 0 0 2px $box-shadow-color-2-primaryProgressive--focus;
			box-shadow: $box-shadow-1-primaryProgressive, $box-shadow-2-primaryProgressive;
			border-color: $box-shadow-color-1-primaryProgressive--focus;
		}
	}

	&--framelessProgressive {
		@extend %textButton;
		border-width: 0;
		color: $font-color-framelessProgressive;
		border-color: $border-color-framelessProgressive;

		&:hover {
			color: $font-color-framelessProgressive--hover;
		}

		&:active {
			color: $font-color-framelessProgressive--active;
		}

		&:focus {
			box-shadow: none;
		}
	}
}
</style>
