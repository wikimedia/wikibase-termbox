import { storiesOf } from '@storybook/vue3';
import { text, boolean } from '@storybook/addon-knobs';
import Checkbox from '@/components/Checkbox.vue';

storiesOf( 'Checkbox', module )
	.addParameters( { component: Checkbox } )
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
		template:
			`<Checkbox
				:value="isChecked"
				@input="isChecked = $event"
				:html-value="'A value'"
				:label="label"
			/>`,
	} ) );
