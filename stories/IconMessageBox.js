import { storiesOf } from '@storybook/vue';
import IconMessageBox from '@/components/IconMessageBox.vue';
import {
	optionsKnob as options,
	text,
} from '@storybook/addon-knobs';

const label = 'flavour';
const valuesObj = {
	error: 'error',
	warning: 'warning',
};

const defaultValue = 'error';
const optionsObj = {
	display: 'inline-radio',
};

const groupId = 'flavour';

storiesOf( 'IconMessageBox', module )
	.add( 'default', () => ( {
		components: { IconMessageBox },
		props: {
			type: {
				default: options( label, valuesObj, defaultValue, optionsObj, groupId ),
			},
			message: {
				default: text( 'error message', 'Terrible things happened!' ),
			},
		},
		template:
			`<div>
				<IconMessageBox :type="type">
					{{ message }}
				</IconMessageBox>
			</div>`,
	} ), { info: true } );
