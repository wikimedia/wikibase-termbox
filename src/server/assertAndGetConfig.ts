import { Config } from './ServiceRunnerOptions';
import Logger from './Logger';
import env from 'env-var';
import {
	DEFAULT_LANGUAGES_CACHE_MAX_AGE,
	DEFAULT_MESSAGES_CACHE_MAX_AGE,
	DEFAULT_REQUEST_TIMEOUT,
} from '@/common/constants';

export default function ( processEnv: NodeJS.ProcessEnv, logger: Logger ): Config {

	const sourcedEnv = env.from( processEnv );
	let config: Config;
	try {
		config = {
			WIKIBASE_REPO: sourcedEnv.get( 'WIKIBASE_REPO' ).required().asUrlString(),
			WIKIBASE_REPO_HOSTNAME_ALIAS: sourcedEnv.get( 'WIKIBASE_REPO_HOSTNAME_ALIAS' ).required().asString(),
			SSR_PORT: sourcedEnv.get( 'SSR_PORT' ).required().asString(),
			MEDIAWIKI_REQUEST_TIMEOUT:
				sourcedEnv.get( 'MEDIAWIKI_REQUEST_TIMEOUT', DEFAULT_REQUEST_TIMEOUT.toString() ).asIntPositive(),
			MESSAGES_CACHE_MAX_AGE:
				sourcedEnv.get( 'MESSAGES_CACHE_MAX_AGE', DEFAULT_MESSAGES_CACHE_MAX_AGE.toString() ).asIntPositive(),
			LANGUAGES_CACHE_MAX_AGE:
				sourcedEnv.get( 'LANGUAGES_CACHE_MAX_AGE', DEFAULT_LANGUAGES_CACHE_MAX_AGE.toString() ).asIntPositive(),
			HEALTHCHECK_QUERY: sourcedEnv.get( 'HEALTHCHECK_QUERY' ).asString() || '',
		};
	} catch ( e ) {
		logger.log( 'fatal/service', 'Failed parsing env vars: ' + e.toString() );
		process.exit( 1 );
	}

	logger.log( 'info/service', 'Set config to: ' + JSON.stringify( config! ) );

	return config!;
}
