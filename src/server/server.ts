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
import assertAndGetConfig from './assertAndGetConfig';
import getMwUserAgentString from './axios/getMwUserAgentString';

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
		},
		options.config,
		logger,
	);

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
