import { mutations } from '@/store/messages/mutations';
import { lockState } from '../lockState';
import {
	MESSAGES_INIT,
} from '@/store/messages/mutationTypes';
import Messages from '@/store/messages/Messages';

describe( 'messages/mutations', () => {

	describe( MESSAGES_INIT, () => {
		it( 'contains messages after initialization', () => {
			const state: Messages = { messages: {} };
			lockState( state );

			const messages = {
				de: {
					test: 'test',
					test2: 'Still a test',
					test3: 'What ever',
				},
			};

			mutations[ MESSAGES_INIT ]( state, messages );

			expect( state.messages.de ).toEqual( messages.de );
		} );
	} );
} );
