interface ServiceRunnerOptions {
	config: {
		WIKIBASE_REPO?: string,
		SSR_PORT?: string,
		MEDIAWIKI_REQUEST_TIMEOUT?: number,
	};
}

export default ServiceRunnerOptions;
