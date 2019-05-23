import { AxiosInstance } from 'axios';
import LRUCache from 'lru-cache';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import { WikibaseApiContentLanguages } from '@/server/data-access/WikibaseContentLanguagesRepo';
import Logger from '@/server/Logger';
import TermboxQueryValidator from '@/server/route-handler/termbox/TermboxQueryValidator';

export default class BundleRendererServices {
	public readonly axios: AxiosInstance;
	public readonly logger: Logger;
	public readonly messageCache: LRUCache<string, MessageTranslationCollection>;
	public readonly languageCache: LRUCache<string, WikibaseApiContentLanguages>;
	public readonly termboxQueryValidator: TermboxQueryValidator;
	public readonly openApiSpec: object;

	public constructor(
		axios: AxiosInstance,
		logger: Logger,
		messageCache: LRUCache<string, MessageTranslationCollection>,
		languageCache: LRUCache<string, WikibaseApiContentLanguages>,
		termboxQueryValidator: TermboxQueryValidator,
		openApiSpec: object,
	) {
		this.axios = axios;
		this.logger = logger;
		this.messageCache = messageCache;
		this.languageCache = languageCache;
		this.termboxQueryValidator = termboxQueryValidator;
		this.openApiSpec = openApiSpec;
	}
}
