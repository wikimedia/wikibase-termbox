import { storiesOf } from '@storybook/vue';
import Checkbox from '@/components/Checkbox.vue';

storiesOf( 'Checkbox', module )
	.add( 'without value, one checked by default', () => ( {
		data() { return { aChecked: false, bChecked: true }; },
		components: { Checkbox },
		template:
			`<p>
				<Checkbox v-model="aChecked" :label="aChecked ? 'Checked!' : 'Not checked!'" />
				<Checkbox v-model="bChecked" :label="bChecked ? 'Checked!' : 'Not checked!'" />
			</p>`,
	} ), { info: true } )
	.add( 'with value', () => ( {
		data() { return { isChecked: false }; },
		components: { Checkbox },
		// eslint-disable-next-line max-len
		template: '<Checkbox v-model="isChecked" :html-value="\'A value\'" :label="isChecked ? \'Checked!\' : \'Not checked!\'" />',
	} ), { info: true } );
