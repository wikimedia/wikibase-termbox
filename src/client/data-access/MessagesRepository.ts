import MessagesRepositoryInterface from '@/common/data-access/MessagesRepository.ts';
import MessageCollection from '@/datamodel/MessageTranslationCollection';
import { MwMessages } from '@/client/mediawiki/MwWindow';
import { MessageKeys } from '@/common/MessageKeys';

export default class MessagesRepository implements MessagesRepositoryInterface {

	private mwMessages: MwMessages;
	private messageKeys: MessageKeys[];

	constructor( messageResolver: MwMessages, messageKeys: MessageKeys[] ) {
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
		this.messageKeys.forEach( ( messageKey: MessageKeys ) => {
			collection[ inLanguage ][ messageKey ] = this.getMessage( messageKey );
		} );
		return collection;
	}

	private getMessage( key: MessageKeys ): string {
		return this.mwMessages( key ).text();
	}
}
