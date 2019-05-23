import 'module-alias/register';
import createApp from './app';
import BundleRendererServices from './bundle-renderer/BundleRendererServices';
import axios from 'axios';
import {
	GLOBAL_REQUEST_PARAMS,
	DEFAULT_REQUEST_TIMEOUT,
	DEFAULT_MESSAGES_CACHE_MAX_AGE,
	DEFAULT_LANGUAGES_CACHE_MAX_AGE,
} from '../common/constants';
import ServiceRunnerOptions from './ServiceRunnerOptions';
import LRUCache from 'lru-cache';
import * as PackageInfo from '@/../package.json';
import openApiJson from '@/../openapi.json';
import assertAndGetConfig from './assertAndGetConfig';
import getMwUserAgentString from './axios/getMwUserAgentString';
import TermboxQueryValidator from './route-handler/termbox/TermboxQueryValidator';
import OpenAPIRequestCoercer from 'openapi-request-coercer';
import OpenAPIRequestValidator from 'openapi-request-validator';
import buildOpenApiSpec from './buildOpenApiSpec';

export default ( options: ServiceRunnerOptions ) => {
	const logger = options.logger;
	const config = assertAndGetConfig(
		{
			WIKIBASE_REPO: {},
			SSR_PORT: {},
			MEDIAWIKI_REQUEST_TIMEOUT: {
				fallback: DEFAULT_REQUEST_TIMEOUT,
			},
			MESSAGES_CACHE_MAX_AGE: {
				fallback: DEFAULT_MESSAGES_CACHE_MAX_AGE,
			},
			LANGUAGES_CACHE_MAX_AGE: {
				fallback: DEFAULT_LANGUAGES_CACHE_MAX_AGE,
			},
			HEALTHCHECK_QUERY: {
				fallback: null,
			},
		},
		options.config,
		logger,
	);

	const termboxSpecParameters = openApiJson.paths[ '/termbox' ].get.parameters;
	const termboxQueryValidator = new TermboxQueryValidator(
		new OpenAPIRequestCoercer( {
			parameters: termboxSpecParameters,
		} ),
		new OpenAPIRequestValidator( {
			parameters: termboxSpecParameters,
		} ),
	);

	let openApiSpec;
	try {
		openApiSpec = buildOpenApiSpec( config.HEALTHCHECK_QUERY!, termboxQueryValidator );
	} catch ( error ) {
		logger.log( 'fatal/service', `HEALTHCHECK_QUERY malformed: ${ JSON.stringify( error.info ) }. Exiting.` );
		process.exit( 1 );
	}

	const services = new BundleRendererServices(
		axios.create( {
			baseURL: config.WIKIBASE_REPO,
			params: GLOBAL_REQUEST_PARAMS,
			timeout: config.MEDIAWIKI_REQUEST_TIMEOUT,
			headers: {
				'User-Agent': getMwUserAgentString( PackageInfo.default ),
			},
		} ),
		logger,
		new LRUCache( {
			max: 1000,
			maxAge: config.MESSAGES_CACHE_MAX_AGE,
		} ),
		new LRUCache( {
			max: 1000,
			maxAge: config.LANGUAGES_CACHE_MAX_AGE,
		} ),
		termboxQueryValidator,
		openApiSpec,
	);

	createApp( services )
		.listen( config.SSR_PORT, () => {
			logger.log( 'info/service', 'server is now running...' );
		} );

	process.on( 'SIGINT', () => {
		logger.log( 'info/service', 'Process received SIGINT' );
		process.exit( 0 );
	} );
};
