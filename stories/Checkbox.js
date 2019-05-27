import { storiesOf } from '@storybook/vue';
import Checkbox from '@/components/Checkbox.vue';

storiesOf( 'Checkbox', module )
	.add( 'without value', () => ( {
		data() { return { isChecked: false }; },
		components: { Checkbox },
		template: '<Checkbox v-model="isChecked" :label="isChecked ? \'Checked!\' : \'Not checked!\'" />',
	} ) )

	.add( 'with value', () => ( {
		data() { return { isChecked: false }; },
		components: { Checkbox },
		// eslint-disable-next-line max-len
		template: '<Checkbox v-model="isChecked" :html-value="\'A value\'" :label="isChecked ? \'Checked!\' : \'Not checked!\'" />',
	} ) );
