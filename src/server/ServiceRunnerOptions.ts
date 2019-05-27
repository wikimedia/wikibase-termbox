import Logger from './Logger';

export interface Config {
	WIKIBASE_REPO?: string,
	WIKIBASE_REPO_HOSTNAME_ALIAS?: string,
	SSR_PORT?: string,
	MEDIAWIKI_REQUEST_TIMEOUT?: number,
	MESSAGES_CACHE_MAX_AGE?: number,
	LANGUAGES_CACHE_MAX_AGE?: number,
	HEALTHCHECK_QUERY?: string,
}

interface ServiceRunnerOptions {
	config: Config;
	logger: Logger;
}

export default ServiceRunnerOptions;
