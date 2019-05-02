interface ServiceRunnerOptions {
	config: {
		WIKIBASE_REPO?: string,
		SSR_PORT?: string,
		MEDIAWIKI_REQUEST_TIMEOUT?: number,
		MESSAGES_CACHE_MAX_AGE?: number,
	};
}

export default ServiceRunnerOptions;
