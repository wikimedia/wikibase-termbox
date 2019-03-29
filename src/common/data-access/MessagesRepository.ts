import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';

interface MessagesRepository {
	getMessagesInLanguage( inLanguage: string ): Promise<MessageTranslationCollection>;
}

export default MessagesRepository;
