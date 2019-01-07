import MessagesRepository from '@/client/data-access/MessagesRepository';
import { MwMessage } from '@/client/mediawiki/MwWindow';

describe( 'MessagesRepository', () => {
	it( 'get mw.message and the messages keys to build a message collection', () => {
		const translations: { [ key: string ]: string } = {
			foo: 'bar',
			edit: 'bearbeiten',
		};

		const mwMessages = ( key: string, ...params: string[] ): MwMessage => {
			return {
				text: () => translations[ key ],
			};
		};

		return (
			new MessagesRepository(
				mwMessages,
				Object.keys( translations ),
			) ).getMessagesInLanguage( 'de' ).then( ( messagesResolved ) => {
			expect( messagesResolved.de ).toStrictEqual( translations );
		} );
	} );
} );
