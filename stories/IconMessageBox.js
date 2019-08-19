import { storiesOf } from '@storybook/vue';
import IconMessageBox from '@/components/IconMessageBox.vue';

storiesOf( 'IconMessageBox', module )
	.add( 'error', () => ( {
		components: { IconMessageBox },
		template:
			`<div>
				<IconMessageBox type="error">
					Terrible things happened!
				</IconMessageBox>
			</div>`,
	} ), { info: true } )
	.add( 'warning', () => ( {
		components: { IconMessageBox },
		template:
			`<div>
				<IconMessageBox type="warning">
					Somewhat bad things happened!
				</IconMessageBox>
			</div>`,
	} ), { info: true } );
