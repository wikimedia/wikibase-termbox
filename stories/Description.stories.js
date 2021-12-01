import { storiesOf } from '@storybook/vue3';
import Description from '@/components/Description.vue';

storiesOf( 'Description', module )
	.addParameters( { component: Description } )
	.add( 'default', () => ( {
		components: { Description },
		data: () => ( { description: { language: 'en', value: 'orange root vegetable' } } ),
		template: '<Description :description="description" />',
	} ) );
