import { storiesOf } from '@storybook/vue3';
import IconMessageBox from '@/components/IconMessageBox.vue';
import {
	optionsKnob as options,
	text,
} from '@storybook/addon-knobs';

storiesOf( 'IconMessageBox', module )
	.addParameters( { component: IconMessageBox } )
	.add( 'default', () => ( {
		components: { IconMessageBox },
		props: {
			type: {
				default: options(
					'type',
					{
						error: 'error',
						warning: 'warning',
					},
					'error',
					{
						display: 'inline-radio',
					},
				),
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
	} ) );
