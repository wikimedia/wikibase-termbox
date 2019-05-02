import 'module-alias/register';
import createApp from './app';
import BundleRendererServices from './bundle-renderer/BundleRendererServices';
import axios from 'axios';
import {
	GLOBAL_REQUEST_PARAMS,
	DEFAULT_REQUEST_TIMEOUT,
} from '../common/constants';
import ServiceRunnerOptions from './ServiceRunnerOptions';

/* eslint-disable no-console */

function verifyAndReportSetting( name: string, value: any ) {
	if ( typeof value === 'undefined' ) {
		console.warn( `${name} env must be configured to a meaningful value. Exiting.` );
		process.exit( 1 );
	}

	console.info( `Set ${name} env to ${value}` );
}

export default ( options: ServiceRunnerOptions ) => {
	const wikibaseRepo = options.config.WIKIBASE_REPO;
	const ssrPort = options.config.SSR_PORT;
	const serverRequestTimeout = options.config.MEDIAWIKI_REQUEST_TIMEOUT || DEFAULT_REQUEST_TIMEOUT;

	verifyAndReportSetting( 'WIKIBASE_REPO', wikibaseRepo );
	verifyAndReportSetting( 'SSR_PORT', ssrPort );
	verifyAndReportSetting( 'MEDIAWIKI_REQUEST_TIMEOUT', serverRequestTimeout );

	const services = new BundleRendererServices(
		axios.create( {
			baseURL: wikibaseRepo,
			params: GLOBAL_REQUEST_PARAMS,
			timeout: serverRequestTimeout,
		} ),
		console,
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
