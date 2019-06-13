import MessagesRepositoryInterface from '@/common/data-access/MessagesRepository';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import { MwMessages } from '@/client/mediawiki/MwWindow';
import { MessageKey } from '@/common/MessageKey';

export default class MessagesRepository implements MessagesRepositoryInterface {

	private mwMessages: MwMessages;
	private messageKeys: MessageKey[];

	public constructor( messageResolver: MwMessages, messageKeys: MessageKey[] ) {
		this.mwMessages = messageResolver;
		this.messageKeys = messageKeys;
	}

	public getMessagesInLanguage( inLanguage: string ): Promise<MessageTranslationCollection> {
		return Promise.resolve( this.getMessageCollection( inLanguage ) );
	}

	private getMessageCollection( inLanguage: string ): MessageTranslationCollection {
		const collection: MessageTranslationCollection = {
			[ inLanguage ]: {},
		};
		this.messageKeys.forEach( ( messageKey: MessageKey ) => {
			collection[ inLanguage ][ messageKey ] = this.getMessage( messageKey );
		} );
		return collection;
	}

	private getMessage( key: MessageKey ): string {
		return this.mwMessages( key ).text();
	}
}
