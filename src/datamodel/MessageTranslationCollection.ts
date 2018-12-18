import MessageCollection from '@/datamodel/MessageCollection';

export default interface MessageTranslationCollection {
	[languageCode: string]: MessageCollection;
}
