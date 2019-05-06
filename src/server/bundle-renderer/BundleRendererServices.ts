import { AxiosInstance } from 'axios';
import LRUCache from 'lru-cache';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';

interface Logger {
	log( ...things: any[] ): void;
}

export default class BundleRendererServices {
	public readonly axios: AxiosInstance;
	public readonly logger: Logger;
	public readonly messageCache: LRUCache<string, MessageTranslationCollection>;

	public constructor(
		axios: AxiosInstance,
		logger: Logger,
		messageCache: LRUCache<string, MessageTranslationCollection>,
	) {
		this.axios = axios;
		this.logger = logger;
		this.messageCache = messageCache;
	}
}
