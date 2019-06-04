import { getters } from '@/store/messages/getters';
import Messages from '@/store/messages/Messages';
import { MessageKey } from '@/common/MessageKey';

describe( 'messages/Getters', () => {

	describe( 'getAllMessagesInLanguage', () => {
		it( 'returns a message for the given language code', () => {
			const messages: Messages = {
				messages: {
					de: {
						[ MessageKey.PUBLISH ]: 'veröffentlichen',
						[ MessageKey.EDIT ]: 'bearbeiten',
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
						[ MessageKey.CANCEL ]: 'abbrechen',
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
						[ MessageKey.CANCEL ]: 'abbrechen',
						[ MessageKey.CREATE_ACCOUNT ]: 'Account erstellen',
					},
				},
			};

			expect( getters.getMessageInLanguage(
				messages, null, null, null,
			)( 'de', MessageKey.CANCEL ) ).toBe( messages.messages.de[ MessageKey.CANCEL ] );
		} );

		it( 'returns null if no message for the message key exists', () => {
			const messages: Messages = {
				messages: {
					de: {
						[ MessageKey.EDIT ]: 'bearbeiten',
					},
				},
			};
			expect( getters.getMessageInLanguage(
				messages, null, null, null,
			)( 'de', 'potato' ) ).toBe( null );
		} );

		it( 'returns null if no message data exists in the given language', () => {
			const messages: Messages = {
				messages: {
					de: {
						[ MessageKey.EDIT ]: 'bearbeiten',
					},
				},
			};
			expect( getters.getMessageInLanguage(
				messages, null, null, null,
			)( 'en', MessageKey.EDIT ) ).toBe( null );
		} );
	} );
} );
