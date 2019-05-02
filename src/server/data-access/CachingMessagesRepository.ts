import MessagesRepository from '@/common/data-access/MessagesRepository';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import LRUCache from 'lru-cache';

export default class CachingMessagesRepository implements MessagesRepository {
	private cache: LRUCache<string, MessageTranslationCollection>;
	private messagesRepository: MessagesRepository;

	public constructor(
		cache: LRUCache<string, MessageTranslationCollection>,
		messagesRepository: MessagesRepository,
	) {
		this.cache = cache;
		this.messagesRepository = messagesRepository;
	}

	getMessagesInLanguage( inLanguage: string ): Promise<MessageTranslationCollection> {
		const cached: MessageTranslationCollection|undefined = this.cache.get( inLanguage );
		if ( cached ) {
			return Promise.resolve( cached );
		}

		return this.messagesRepository.getMessagesInLanguage( inLanguage ).then( ( messages ) => {
			this.cache.set( inLanguage, messages );
			return messages;
		} );
	}

}
