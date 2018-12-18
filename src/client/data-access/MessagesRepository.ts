import MessagesRepository from '@/common/data-access/MessagesRepository.ts';
import MessageCollection from '@/datamodel/MessageTranslationCollection';
import { MwMessages } from '@/client/mediawiki/MwWindow';
import { MessageKeys } from '@/common/MessageKeys';

export default class ClientMessagesRepository implements MessagesRepository {

	private mwMessages: MwMessages;

	constructor( messageResolver: MwMessages ) {
		this.mwMessages = messageResolver;
	}

	public getMessagesInLanguage( inLanguage: string ): Promise<MessageCollection> {
		return Promise.resolve( this.getMessageCollection( inLanguage ) );
	}

	private getMessageCollection( inLanguage: string ): MessageCollection {
		const collection: MessageCollection = {};
		collection[ inLanguage ] = {};
		Object.values( MessageKeys ).map( ( values: any ) => {
			collection[ inLanguage ][ values ] = this.getMessage( values );
		} );
		return collection;
	}

	private getMessage( key: string ): string {
		return this.mwMessages( key ).text();
	}
}
