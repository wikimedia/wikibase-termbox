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
	} ), { info: true } )
	.add( 'publish', () => ( {
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="publish" message="publish" />',
	} ), { info: true } )
	.add( 'normal', () => ( {
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="normal" message="normal" />',
	} ), { info: true } )
	.add( 'primaryProgressive', () => ( {
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="primaryProgressive" message="primaryProgressive" />',
	} ), { info: true } )
	.add( 'framelessProgressive', () => ( {
		components: { EventEmittingButton },
		template: '<EventEmittingButton type="framelessProgressive" message="framelessProgressive" />',
	} ), { info: true } )
	.add( 'framelessProgressive as link', () => ( {
		components: { EventEmittingButton },
		template: `<EventEmittingButton
			type="framelessProgressive"
			message="go (opens in new tab)"
			href="https://www.wikidata.org/"
			:preventDefault="false"
			target="_blank" />`,
	} ), { info: true } );
