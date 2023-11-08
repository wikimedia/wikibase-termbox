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
	font-family: $font-family-base;
	display: inline-block;
	cursor: pointer;
	white-space: nowrap;
	text-decoration: none;
	font-weight: bold;
}

%framed {
	border-width: $border-width-base;
	border-radius: $border-radius-base;
	border-style: $border-style-base;
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
		background-color: $background-color-interactive;
		color: $color-base;
		border-color: $border-color-base;

		&:hover {
			background-color: $background-color-base;
			color: $color-base; // intentionally not $color-base--hover as it's meant to be removed
			border-color: $border-color-base;
		}

		&:active {
			background-color: #c8ccd1;
			color: $color-emphasized;
			border-color: $border-color-interactive;
		}

		&:focus {
			box-shadow: $box-shadow-inset-small $box-shadow-color-progressive--focus;
		}
	}

	&--primaryProgressive {
		@extend %textButton;
		@extend %framed;
		background-color: $background-color-progressive;
		color: $color-inverted;
		border-color: $border-color-progressive;

		&:hover {
			background-color: $background-color-progressive--hover;
			border-color: $border-color-progressive--hover;
		}

		&:active {
			background-color: $background-color-progressive--active;
			border-color: $border-color-progressive--active;
		}

		&:focus {
			box-shadow: $box-shadow-inset-small $box-shadow-color-progressive--focus, $box-shadow-inset-medium $box-shadow-color-inverted;
		}
	}

	&--framelessProgressive {
		@extend %textButton;
		border-width: 0;
		color: $color-progressive;
		border-color: $border-color-inverted;

		&:hover {
			color: $color-progressive--hover;
		}

		&:active {
			color: $color-progressive--active;
		}

		&:focus {
			box-shadow: none;
		}
	}
}
</style>
