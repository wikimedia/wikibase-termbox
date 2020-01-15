import { storiesOf } from '@storybook/vue';
import { text, boolean } from '@storybook/addon-knobs';
import Checkbox from '@/components/Checkbox.vue';

storiesOf( 'Checkbox', module )
	.add( 'default', () => ( {
		components: { Checkbox },
		props: {
			isChecked: {
				default: boolean( 'Checked', false ),
			},
			label: {
				default: text( 'Label', 'sample label' ),
			},
		},
		// eslint-disable-next-line max-len
		template: '<Checkbox v-model="isChecked" :html-value="\'A value\'" :label="label" />',
	} ) );
