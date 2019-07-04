import { AxiosInstance } from 'axios';
import LRUCache from 'lru-cache';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import { WikibaseApiContentLanguages } from '@/server/data-access/WikibaseContentLanguagesRepo';
import Logger from '@/server/Logger';
import CoercingQueryValidator from '@/server/route-handler/termbox/CoercingQueryValidator';
import Metrics from '@/server/Metrics';

export default class BundleRendererServices {
	public readonly axios: AxiosInstance;
	public readonly logger: Logger;
	public readonly metrics: Metrics;
	public readonly messageCache: LRUCache<string, MessageTranslationCollection>;
	public readonly languageCache: LRUCache<string, WikibaseApiContentLanguages>;
	public readonly termboxQueryValidator: CoercingQueryValidator;
	public readonly openApiSpec: object;

	public constructor(
		axios: AxiosInstance,
		logger: Logger,
		metrics: Metrics,
		messageCache: LRUCache<string, MessageTranslationCollection>,
		languageCache: LRUCache<string, WikibaseApiContentLanguages>,
		termboxQueryValidator: CoercingQueryValidator,
		openApiSpec: object,
	) {
		this.axios = axios;
		this.logger = logger;
		this.metrics = metrics;
		this.messageCache = messageCache;
		this.languageCache = languageCache;
		this.termboxQueryValidator = termboxQueryValidator;
		this.openApiSpec = openApiSpec;
	}
}
