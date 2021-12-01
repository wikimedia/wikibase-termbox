import { storiesOf } from '@storybook/vue3';
import { boolean } from '@storybook/addon-knobs';
import Label from '@/components/Label.vue';

storiesOf( 'Label', module )
	.addParameters( { component: Label } )
	.add( 'default', () => ( {
		components: { Label },
		data: () => ( { label: { language: 'en', value: 'carrot' } } ),
		props: {
			isPrimary: {
				default: boolean( 'Is primary', false ),
			},
		},
		template: '<Label :label="label" :is-primary="isPrimary" />',
	} ) );
