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
import { defineComponent } from 'vue';

const validTypes = [
	'normal',
	'primaryProgressive',
	'framelessProgressive',
	'edit',
	'publish',
	'cancel',
];

export default defineComponent( {
	name: 'EventEmittingButton',
	props: {
		type: {
			required: true,
			validator: ( type: string ) => validTypes.indexOf( type ) !== -1,
		},
		message: { required: true, type: String },
		href: { required: false, default: '#', type: String },
		preventDefault: { required: false, default: true, type: Boolean },
	},
	emits: [ 'click' ],
	methods: {
		click( event: MouseEvent ): void {
			if ( this.preventDefault ) {
				event.preventDefault();
			}
			this.$emit( 'click', event );
		},
	},
} );
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

		// default & hover are flipped compared to background-color-base & background-color-base--hover
		background-color: $wmui-color-base80;
		color: $color-base;
		border-color: $border-color-base;

		&:hover {
			background-color: $wmui-color-base100;
			color: $color-base; // intentionally not $color-base--hover for reasons
			border-color: $border-color-base--hover;
		}

		&:active {
			background-color: $wmui-color-base70;
			color: $color-base--active;
			border-color: $border-color-base--active;
		}

		&:focus {
			box-shadow: $box-shadow-base--focus;
		}
	}

	&--primaryProgressive {
		@extend %textButton;
		@extend %framed;
		background-color: $color-primary;
		color: $color-base--inverted;
		border-color: $color-primary;

		&:hover {
			background-color: $color-primary--hover;
			border-color: $color-primary--hover;
		}

		&:active {
			background-color: $color-primary--active;
			border-color: $color-primary--active;
		}

		&:focus {
			box-shadow: $box-shadow-primary--focus;
		}
	}

	&--framelessProgressive {
		@extend %textButton;
		border-width: 0;
		color: $color-primary;
		border-color: $wmui-color-base100;

		&:hover {
			color: $color-primary--hover;
		}

		&:active {
			color: $color-primary--active;
		}

		&:focus {
			box-shadow: none;
		}
	}
}
</style>
