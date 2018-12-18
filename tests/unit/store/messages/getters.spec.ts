import { getters } from '@/store/messages/getters';
import Messages from '@/store/messages/Messages';

describe( 'messages/Getters', () => {

	describe( 'getMessageInLanguage', () => {
		it( 'returns a message for the given language code', () => {
			const messages: Messages = {
				messages: {
					de: {
						toefften: 'potato',
						plumen: 'Pflaumen',
					},
				},
			};

			expect( getters.getAllMessagesInLanguage(
				messages, null, null, null,
			)( 'de' ) ).toStrictEqual( messages.messages.de );
		} );

		it( 'returns null for the non-existing language code', () => {
			const messages: Messages = {
				messages: {
					de: {
						toefften: 'potato',
					},
				},
			};
			expect( getters.getAllMessagesInLanguage(
				messages, null, null, null,
			)( 'en' ) ).toBe( null );
		} );
	} );

	describe( 'getMessageInLanguage', () => {

		it( 'returns a message for the given messageKey', () => {
			const messages: Messages = {
				messages: {
					de: {
						toefften: 'potato',
						plumen: 'Pflaumen',
					},
				},
			};

			expect( getters.getMessageInLanguage(
				messages, null, null, null,
			)( 'de' , 'toefften' ) ).toBe( messages.messages.de.toefften );
		} );

		it( 'returns null if no message for the messageKey exists', () => {
			const messages: Messages = {
				messages: {
					de: {
						plumen: 'Pflaumen',
					},
				},
			};
			expect( getters.getMessageInLanguage(
				messages, null, null, null,
			)( 'en', 'plumen' ) ).toBe( null );
		} );

		it( 'returns null if no message for the messageKey exists', () => {
			const messages: Messages = {
				messages: {
					de: {
						plumen: 'Pflaumen',
					},
				},
			};
			expect( getters.getMessageInLanguage(
				messages, null, null, null,
			)( 'de', 'toefften' ) ).toBe( null );
		} );
	} );
} );
