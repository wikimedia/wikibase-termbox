import MessagesRepository from '@/client/data-access/MessagesRepository';
import { MwMessage } from '@/client/mediawiki/MwWindow';
import { MessageKeys } from '@/common/MessageKeys';
import MessageCollection from '@/datamodel/MessageCollection';

describe( 'MessagesRepository', () => {
	it( 'get mw.message and the messages keys to build a message collection', () => {
		const translations: MessageCollection = {
			[ MessageKeys.PUBLISH ]: 'bar',
			[ MessageKeys.EDIT ]: 'bearbeiten',
		};

		const mwMessages = ( key: MessageKeys ): MwMessage => {
			return {
				text: () => translations[ key ]!,
			};
		};

		return (
			new MessagesRepository(
				mwMessages,
				Object.keys( translations ) as MessageKeys[],
			) ).getMessagesInLanguage( 'de' ).then( ( messagesResolved ) => {
			expect( messagesResolved.de ).toStrictEqual( translations );
		} );
	} );
} );
