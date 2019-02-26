import 'module-alias/register';
import createApp from './app';
import BundleRendererServices from './bundle-renderer/BundleRendererServices';
import axios from 'axios';
import { GLOBAL_REQUEST_PARAMS } from '../common/constants';

function verifyAndReportSetting( name: string, value: any ) {
	if ( typeof value === 'undefined' ) {
		console.warn( `${name} env must be configured to a meaningful value. Exiting.` );
		process.exit( 1 );
	}

	console.info( `Set ${name} env to ${value}` );
}

verifyAndReportSetting( 'WIKIBASE_REPO', process.env.WIKIBASE_REPO );
verifyAndReportSetting( 'SSR_PORT', process.env.SSR_PORT );

const services = new BundleRendererServices(
	axios.create( {
		baseURL: process.env.WIKIBASE_REPO,
		params: GLOBAL_REQUEST_PARAMS,
	} ),
	console,
);

createApp( services )
	.listen( process.env.SSR_PORT, () => {
		console.info( `server is now running...` );
	} );

process.on( 'SIGINT', () => {
	console.info( 'Process received SIGINT' );
	process.exit( 0 );
} );
