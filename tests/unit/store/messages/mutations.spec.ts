import { mutations } from '@/store/messages/mutations';
import {
	MESSAGES_INIT,
} from '@/store/messages/mutationTypes';
import Messages from '@/store/messages/Messages';
import MessageCollection from '@/datamodel/MessageTranslationCollection';

describe( 'message/mutations', () => {

	describe( MESSAGES_INIT, () => {
		it( 'contains messages after initialization', () => {
			const store: Messages = { messages: {} };
			const messages = {
				de: {
					test: 'test',
					test2: 'Still a test',
					test3: 'What ever',
				},
			} as MessageCollection;

			mutations[ MESSAGES_INIT ]( store, messages );

			expect( store.messages.de.test ).toBe( messages.de.test );
			expect( store.messages.de.test3 ).toBe( messages.de.test3 );
		} );

	} );

} );
