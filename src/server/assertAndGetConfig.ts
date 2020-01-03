import { Config } from './ServiceRunnerOptions';
import Logger from './Logger';
import {
	DEFAULT_LANGUAGES_CACHE_MAX_AGE,
	DEFAULT_MESSAGES_CACHE_MAX_AGE,
	DEFAULT_REQUEST_TIMEOUT,
} from '@/common/constants';
import Joi from '@hapi/joi';

export default function ( processEnv: NodeJS.ProcessEnv, logger: Logger ): Config {
	const schema = Joi.object( {
		WIKIBASE_REPO: Joi.string().uri().required(),
		WIKIBASE_REPO_HOSTNAME_ALIAS: Joi.string().hostname().required(),
		SSR_PORT: Joi.number().port().required(),
		MEDIAWIKI_REQUEST_TIMEOUT: Joi.number()
			.positive().integer()
			.empty( '' ).default( DEFAULT_REQUEST_TIMEOUT ),
		MESSAGES_CACHE_MAX_AGE: Joi.number()
			.positive().integer()
			.empty( '' ).default( DEFAULT_MESSAGES_CACHE_MAX_AGE ),
		LANGUAGES_CACHE_MAX_AGE: Joi.number()
			.positive().integer()
			.empty( '' ).default( DEFAULT_LANGUAGES_CACHE_MAX_AGE ),
		HEALTHCHECK_QUERY: Joi.string().empty( '' ).default( '' ),
	} ).options( { stripUnknown: true } );

	const { error, value: config } = schema.validate( processEnv );

	if ( error ) {
		logger.log( 'fatal/service', `Failed parsing env vars: ${error.toString()}` );
		process.exit( 1 );
	}

	logger.log( 'info/service', `Set config to: ${JSON.stringify( config )}` );

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return config as any;
}
