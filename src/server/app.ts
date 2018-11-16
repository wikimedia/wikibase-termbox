import fs from 'fs';
import express from 'express';
import { createBundleRenderer } from 'vue-server-renderer';
import TermboxHandler from './route-handler/termbox/TermboxHandler';
import QueryValidator from './route-handler/termbox/QueryValidator';
import MwBotWikibaseRepo from './data-access/MwBotWikibaseRepo';
import InvalidRequest from './route-handler/termbox/error/InvalidRequest';
import EntityNotFound from './route-handler/termbox/error/EntityNotFound';
import EntityInitializer from '@/common/EntityInitializer';
import mwbot from 'mwbot';

const app = express();
const serverBundle = fs.readFileSync( './serverDist/vue-ssr-server-bundle.json' );
const renderer = createBundleRenderer(
	JSON.parse( serverBundle.toString() ),
	{ runInNewContext: false },
);

app.get( '/termbox', ( _, res ) => {
	const termboxHandler = new TermboxHandler(
		new QueryValidator(),
		new MwBotWikibaseRepo(
			new mwbot( {
				apiUrl: app.get( 'WIKIBASE_REPO_API' ),
			} ),
			new EntityInitializer(),
		),
	);

	termboxHandler
		.createTermboxRequest( _.query )
		.then( renderer.renderToString )
		.then( ( html ) => {
			res.send( html );
		} )
		.catch( ( err ) => {
			if ( err instanceof InvalidRequest ) {
				res.status( 400 ).send( 'Bad request' );
			} else if ( err instanceof EntityNotFound ) {
				res.status( 404 ).send( 'Entity not found' );
			} else {
				res.status( 500 ).send( 'Technical problem ' + JSON.stringify( err ) );
			}
		} );
} );

export default app;
