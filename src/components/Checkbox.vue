<template>
	<span class="wb-ui-checkbox">
		<input
			type="checkbox"
			:id="id"
			class="wb-ui-checkbox__box"
			@change="$emit( 'input', $event.target.checked )"
			:value="htmlValue"
			:checked="value"
		>
		<label
			class="wb-ui-checkbox__label"
			:for="id"
		>{{ label }}</label>
	</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'Checkbox',
	props: {
		value: { required: true, type: Boolean },
		label: { required: true, type: String },
		htmlValue: { required: false, type: String, default: '' },
	},
	data() {
		return {
			id: `wb-ui-${Math.round( Math.random() * 10000 )}`, // see:https://github.com/vuejs/vue/issues/5886
		};
	},
	emits: [ 'input' ],
} );
</script>
<style lang="scss">
$label: '.wb-ui-checkbox__label';

.wb-ui-checkbox {
	&__label {
		font-family: $font-family-base;
		cursor: pointer;
		display: flex;
		align-items: center;
		line-height: 1.2;

		&:before {
			min-width: $size-input-binary;
			min-height: $size-input-binary;
			border: $border-base;
			border-color: $border-color-input-binary;
			border-radius: $border-radius-base;
			content: ' ';
			margin-right: 1em;
			display: flex;
			background-color: $background-color-base; /* Workaround Firefox e.a. */
			transition: background-color $transition-duration-base, border-color $transition-duration-base, box-shadow $transition-duration-base;
		}

		&:hover {
			&:before {
				border-color: $border-color-base;
			}
		}

		&:active {
			&:before {
				background-color: $background-color-progressive--active;
				border-color: $border-color-progressive--active;
				box-shadow: $box-shadow-inset-small $box-shadow-color-progressive--active;
			}
		}
	}

	&__box {/* see: https://www.w3schools.com/howto/howto_css_custom_checkbox.asp */
		width: 0;
		height: 0;
		opacity: 0;
		left: 0;/* we move it out of our way */
		position: absolute;

		&:focus + #{$label} {
			&:before {
				border-color: $border-color-progressive;
				box-shadow: $box-shadow-inset-small $box-shadow-color-progressive--focus;
			}
		}

		&:checked {
			&:focus + #{$label} {
				&:before {
					box-shadow: $box-shadow-inset-small $box-shadow-color-progressive--focus, $box-shadow-inset-medium $box-shadow-color-inverted;
				}
			}

			& + #{$label} {
				&:before {
					border-color: $border-color-progressive;
					background: $background-color-progressive $svg-check 50% 50% no-repeat;
				}

				&:hover {
					&:before {
						background-color: $background-color-progressive--hover;
					}
				}

				&:active {
					&:before {
						background-color: $background-color-progressive--active;
					}
				}
			}
		}
	}
}
</style>
