import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';

export default interface MessagesRepository {
	getMessagesInLanguage( inLanguage: string ): Promise<MessageTranslationCollection>;
}
