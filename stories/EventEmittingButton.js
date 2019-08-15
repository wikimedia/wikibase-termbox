import { storiesOf } from '@storybook/vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';

storiesOf( 'EventEmittingButton', module )
	.add(
		'edit',
		() => ( {
			components: { EventEmittingButton },
			template: '<EventEmittingButton type="edit" message="edit" />',
		} ),
		{
			info: {
				summary: 'A CTA for the user to edit data',
			},
		},
	)
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
	} ) )
	.add( 'framelessProgressive as link', () => ( {
		components: { EventEmittingButton },
		template: `<EventEmittingButton
			type="framelessProgressive"
			message="go (opens in new tab)"
			href="https://www.wikidata.org/"
			:preventDefault="false"
			target="_blank" />`,
	} ) );
