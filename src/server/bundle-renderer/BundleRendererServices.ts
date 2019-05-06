import { AxiosInstance } from 'axios';
import LRUCache from 'lru-cache';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import { WikibaseApiContentLanguages } from '@/server/data-access/WikibaseContentLanguagesRepo';

interface Logger {
	log( ...things: any[] ): void;
}

export default class BundleRendererServices {
	public readonly axios: AxiosInstance;
	public readonly logger: Logger;
	public readonly messageCache: LRUCache<string, MessageTranslationCollection>;
	public readonly languageCache: LRUCache<string, WikibaseApiContentLanguages>;

	public constructor(
		axios: AxiosInstance,
		logger: Logger,
		messageCache: LRUCache<string, MessageTranslationCollection>,
		languageCache: LRUCache<string, WikibaseApiContentLanguages>,
	) {
		this.axios = axios;
		this.logger = logger;
		this.messageCache = messageCache;
		this.languageCache = languageCache;
	}
}
