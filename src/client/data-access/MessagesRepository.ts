import MessagesRepository from '@/common/data-access/MessagesRepository.ts';
import MessageCollection from '@/datamodel/MessageTranslationCollection';
import { MwMessages } from '@/client/mediawiki/MwWindow';

export default class ClientMessagesRepository implements MessagesRepository {

	private mwMessages: MwMessages;
	private messageKeys: string[];

	constructor( messageResolver: MwMessages, messageKeys: string[] ) {
		this.mwMessages = messageResolver;
		this.messageKeys = messageKeys;
	}

	public getMessagesInLanguage( inLanguage: string ): Promise<MessageCollection> {
		return Promise.resolve( this.getMessageCollection( inLanguage ) );
	}

	private getMessageCollection( inLanguage: string ): MessageCollection {
		const collection: MessageCollection = {
			[ inLanguage ]: {},
		};
		this.messageKeys.forEach( ( messageKey: string ) => {
			collection[ inLanguage ][ messageKey ] = this.getMessage( messageKey );
		} );
		return collection;
	}

	private getMessage( key: string ): string {
		return this.mwMessages( key ).text();
	}
}
