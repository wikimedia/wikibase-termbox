import MessageCollection from '@/datamodel/MessageCollection';

interface MessageTranslationCollection {
	[ languageCode: string ]: MessageCollection;
}

export default MessageTranslationCollection;
