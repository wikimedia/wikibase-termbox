import { storiesOf } from '@storybook/vue';
import IndeterminateProgressBar from '@/components/IndeterminateProgressBar.vue';

storiesOf( 'IndeterminateProgressBar', module )
	.add( 'default', () => ( {
		components: { IndeterminateProgressBar },
		template:
			`<div>
				<IndeterminateProgressBar />
			</div>`,
	} ), { info: true } );
