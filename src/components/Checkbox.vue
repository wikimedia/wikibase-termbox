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
		font-family: $font-family-sans;
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
			background-color: $color-checkbox; /* Workaround Firefox e.a. */
			transition: background-color $transition-base, border-color $transition-base, box-shadow $transition-base;
		}

		&:hover {
			&:before {
				border-color: $border-color-base;
			}
		}

		&:active {
			&:before {
				background-color: $color-primary--active;
				border-color: $color-primary--active;
				box-shadow: inset 0 0 0 $border-width-base $color-primary--active;
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
				border-color: $color-primary;
				box-shadow: inset 0 0 0 $border-width-base $color-primary;
			}
		}

		&:checked {
			&:focus + #{$label} {
				&:before {
					box-shadow: $box-shadow-primary--focus;
				}
			}

			& + #{$label} {
				&:before {
					border-color: $color-primary;
					background: $color-primary $svg-check 50% 50% no-repeat;
				}

				&:hover {
					&:before {
						background-color: $color-primary--hover;
					}
				}

				&:active {
					&:before {
						background-color: $color-primary--active;
					}
				}
			}
		}
	}
}
</style>
