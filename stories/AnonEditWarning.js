import { storiesOf } from '@storybook/vue';
import Modal from '@/components/Modal.vue';
import AnonEditWarning from '@/components/AnonEditWarning.vue';
import { createStore } from '@/store';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { NS_MESSAGES, NS_USER } from '@/store/namespaces';
import { mutation } from '@/store/util';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { MessageKeys } from '@/common/MessageKeys';

storiesOf( 'AnonEditWarning', module )
	.add( 'in Modal', () => {
		const store = createStore();

		// TODO ability to stub Messages mixin
		store.commit( mutation( NS_USER, LANGUAGE_INIT ), 'qq' );
		store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
			qq: {
				[ MessageKeys.LOGIN ]: 'asinus',
				[ MessageKeys.CREATE_ACCOUNT ]: 'dolor',
				[ MessageKeys.EDIT_WARNING_DISMISS_BUTTON ]: 'lorem ipsum',
				[ MessageKeys.EDIT_WARNING_HEADING ]: 'amet',
				[ MessageKeys.EDIT_WARNING_MESSAGE ]: 'Nunc volutpat mattis augue. Sed eu enim vitae dui.',
			},
		} );

		return {
			components: { AnonEditWarning, Modal },
			store,
			template: '<Modal><AnonEditWarning /></Modal>',
		};
	} );
