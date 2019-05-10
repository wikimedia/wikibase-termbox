import { storiesOf } from '@storybook/vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';

storiesOf( 'EventEmittingButton', module )
	.add( 'edit', () => ( {
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="edit" message="edit" />',
	} ) )
	.add( 'cancel', () => ( {
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="cancel" message="cancel" />',
	} ) )
	.add( 'publish', () => ( {
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="publish" message="publish" />',
	} ) )
	.add( 'normal', () => ( {
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="normal" message="normal" />',
	} ) )
	.add( 'primaryProgressive', () => ( {
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="primaryProgressive" message="primaryProgressive" />',
	} ) )
	.add( 'framelessProgressive', () => ( {
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="framelessProgressive" message="framelessProgressive" />',
	} ) );
