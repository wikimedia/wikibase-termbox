import server from './server';
import ServiceRunnerOptions from './ServiceRunnerOptions';

const messagesCacheMaxAge = process.env.MESSAGES_CACHE_MAX_AGE;
const languagesCacheMaxAge = process.env.LANGUAGES_CACHE_MAX_AGE;
const options: ServiceRunnerOptions = {
	config: {
		WIKIBASE_REPO: process.env.WIKIBASE_REPO,
		SSR_PORT: process.env.SSR_PORT,
		MEDIAWIKI_REQUEST_TIMEOUT: ( process.env.MEDIAWIKI_REQUEST_TIMEOUT as any ) as number,
		MESSAGES_CACHE_MAX_AGE: messagesCacheMaxAge ? parseInt( messagesCacheMaxAge ) : undefined,
		LANGUAGES_CACHE_MAX_AGE: languagesCacheMaxAge ? parseInt( languagesCacheMaxAge ) : undefined,
	},
};
server( options );
