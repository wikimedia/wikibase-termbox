import MessagesRepository from '@/client/data-access/MessagesRepository';
import { MwMessage } from '@/client/mediawiki/MwWindow';
import { MessageKey } from '@/common/MessageKey';
import MessageCollection from '@/datamodel/MessageCollection';

describe( 'MessagesRepository', () => {
	it( 'get mw.message and the messages keys to build a message collection', () => {
		const translations: MessageCollection = {
			[ MessageKey.PUBLISH ]: 'bar',
			[ MessageKey.EDIT ]: 'bearbeiten',
		};

		const mwMessages = ( key: MessageKey ): MwMessage => {
			return {
				text: () => translations[ key ]!,
			};
		};

		return (
			new MessagesRepository(
				mwMessages,
				Object.keys( translations ) as MessageKey[],
			) ).getMessagesInLanguage( 'de' ).then( ( messagesResolved ) => {
			expect( messagesResolved.de ).toStrictEqual( translations );
		} );
	} );
} );
