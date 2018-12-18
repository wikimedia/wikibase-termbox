import MessagesRepository from '@/client/data-access/MessagesRepository';
import { MwMessages } from '@/client/mediawiki/MwWindow';
import { MessageKeys } from '@/common/MessageKeys';

class Message {
	private messageText: string;

	constructor( messageText: string ) {
		this.messageText = messageText;
	}

	public text() {
		return this.messageText;
	}
}

describe( 'MessagesRepository', () => {
	it( 'get mw.message and the messages keys to build a message collection', () => {
		const keyList: { [ messageKey: string ]: string } = {};
		Object.keys( MessageKeys ).map( ( key: any ) => {
			keyList[ MessageKeys[ key ] ] = MessageKeys[ key ];
		} );

		const messages: MwMessages = ( key: string, ...params: string[] ) => new Message( key );

		return (
			new MessagesRepository(
				messages,
		) ).getMessagesInLanguage( 'de' ).then( ( messagesResolved ) => {
			expect( messagesResolved ).toStrictEqual( {
				de: keyList,
			} );
		} );
	} );
} );
