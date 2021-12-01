import { app, storiesOf } from '@storybook/vue3';
import Modal from '@/components/Modal.vue';
import AnonEditWarning from '@/components/AnonEditWarning.vue';
import { MessageKey } from '@/common/MessageKey';
import stubMessagesMixin from '../.storybook/helpers/stubMessagesMixin';
import { createStore } from '@/store';

storiesOf( 'AnonEditWarning', module )
	.addParameters( { component: AnonEditWarning } )
	.add( 'in Modal', () => {
		const messages = {
			[ MessageKey.LOGIN ]: 'asinus',
			[ MessageKey.CREATE_ACCOUNT ]: 'dolor',
			[ MessageKey.EDIT_WARNING_DISMISS_BUTTON ]: 'lorem ipsum',
			[ MessageKey.EDIT_WARNING_DISMISS_PERSIST ]: 'historia amend',
			[ MessageKey.EDIT_WARNING_HEADING ]: 'amet',
			[ MessageKey.EDIT_WARNING_MESSAGE ]: 'Nunc volutpat mattis augue. Sed eu enim vitae dui.',
		};

		app.use( createStore( {
			get: () => ( {} ),
		} ) );

		return {
			components: {
				AnonEditWarning: stubMessagesMixin( AnonEditWarning, messages ),
				Modal,
			},
			template: '<Modal><AnonEditWarning /></Modal>',
		};
	} );
