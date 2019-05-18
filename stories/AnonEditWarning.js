import { storiesOf } from '@storybook/vue';
import Modal from '@/components/Modal.vue';
import AnonEditWarning from '@/components/AnonEditWarning.vue';
import { MessageKeys } from '@/common/MessageKeys';
import stubMessagesMixin from '../.storybook/helpers/stubMessagesMixin';
import { createStore } from '@/store';

storiesOf( 'AnonEditWarning', module )
	.add( 'in Modal', () => {
		const messages = {
			[ MessageKeys.LOGIN ]: 'asinus',
			[ MessageKeys.CREATE_ACCOUNT ]: 'dolor',
			[ MessageKeys.EDIT_WARNING_DISMISS_BUTTON ]: 'lorem ipsum',
			[ MessageKeys.EDIT_WARNING_HEADING ]: 'amet',
			[ MessageKeys.EDIT_WARNING_MESSAGE ]: 'Nunc volutpat mattis augue. Sed eu enim vitae dui.',
		};

		return {
			store: createStore(),

			components: {
				AnonEditWarning: stubMessagesMixin( AnonEditWarning, messages ),
				Modal,
			},
			template: '<Modal><AnonEditWarning /></Modal>',
		};
	} );
