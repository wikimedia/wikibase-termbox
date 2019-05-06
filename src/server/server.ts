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

/* eslint-disable no-console */

function assertAndGetSetting( config: { [ index: string ]: any }, name: string, fallback?: any ): any {
	let value = config[ name ];

	if ( typeof value === 'undefined' ) {
		if ( typeof fallback === 'undefined' ) {
			console.warn( `${name} env must be configured to a meaningful value. Exiting.` );
			process.exit( 1 );
		}

		value = fallback;
	}

	console.info( `Set ${name} to ${value}` );

	return value;
}

export default ( options: ServiceRunnerOptions ) => {
	const config = options.config;
	const wikibaseRepo = assertAndGetSetting( config, 'WIKIBASE_REPO' );
	const ssrPort = assertAndGetSetting( config, 'SSR_PORT' );
	const serverRequestTimeout = assertAndGetSetting( config, 'MEDIAWIKI_REQUEST_TIMEOUT', DEFAULT_REQUEST_TIMEOUT );
	const messageCacheMaxAge = assertAndGetSetting( config, 'MESSAGES_CACHE_MAX_AGE', DEFAULT_MESSAGES_CACHE_MAX_AGE );
	const languageCacheMaxAge = assertAndGetSetting(
		config,
		'LANGUAGES_CACHE_MAX_AGE',
		DEFAULT_LANGUAGES_CACHE_MAX_AGE
	);

	const services = new BundleRendererServices(
		axios.create( {
			baseURL: wikibaseRepo,
			params: GLOBAL_REQUEST_PARAMS,
			timeout: serverRequestTimeout,
		} ),
		console,
		new LRUCache( {
			max: 1000,
			maxAge: messageCacheMaxAge,
		} ),
		new LRUCache( {
			max: 1000,
			maxAge: languageCacheMaxAge,
		} ),
	);

	createApp( services )
		.listen( ssrPort, () => {
			console.info( 'server is now running...' );
		} );

	process.on( 'SIGINT', () => {
		console.info( 'Process received SIGINT' );
		process.exit( 0 );
	} );
};
