import { storiesOf } from '@storybook/vue3';
import {
	text,
	boolean,
} from '@storybook/addon-knobs';
import EventEmittingButton from '@/components/EventEmittingButton.vue';

storiesOf( 'EventEmittingButton', module )
	.addParameters( { component: EventEmittingButton } )
	.add(
		'edit',
		() => ( {
			props: {
				message: {
					default: text( 'button label', 'edit' ),
				},
				preventDefault: {
					default: boolean( 'as external link', false ),
				},

			},
			components: { EventEmittingButton },
			template: '<EventEmittingButton type="edit" :message="message" :preventDefault="preventDefault"/>',
		} ),
	)
	.add( 'cancel', () => ( {
		props: {
			message: {
				default: text( 'button label', 'cancel' ),
			},
			preventDefault: {
				default: boolean( 'as external link', false ),
			},
		},
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="cancel" :message="message"  :preventDefault="preventDefault"/>',
	} ) )
	.add( 'publish', () => ( {
		props: {
			message: {
				default: text( 'button label', 'publish' ),
			},
			preventDefault: {
				default: boolean( 'as external link', false ),
			},
		},
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="publish" :message="message" :preventDefault="preventDefault"/>',
	} ), { info: true } )
	.add( 'normal', () => ( {
		props: {
			message: {
				default: text( 'button label', 'normal' ),
			},
			preventDefault: {
				default: boolean( 'as external link', false ),
			},
		},
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="normal" :message="message" :preventDefault="preventDefault"/>',
	} ) )
	.add( 'primaryProgressive', () => ( {
		props: {
			message: {
				default: text( 'button label', 'primaryProgressive' ),
			},
			preventDefault: {
				default: boolean( 'as external link', false ),
			},
		},
		components: { EventEmittingButton },
		template: `<EventEmittingButton type="primaryProgressive"
						:message="message" :preventDefault="preventDefault"/>`,
	} ) )
	.add( 'framelessProgressive', () => ( {
		props: {
			message: {
				default: text( 'button label', 'frameless Progressive' ),
			},
			preventDefault: {
				default: boolean( 'as external link', false ),
			},
		},
		components: { EventEmittingButton },
		template: `<EventEmittingButton type="framelessProgressive"
						:message="message" :preventDefault="preventDefault"/>`,
	} ) );
