import fs from 'fs';
import express from 'express';
import { createBundleRenderer } from 'vue-server-renderer';
import TermboxHandler from './route-handler/termbox/TermboxHandler';
import QueryValidator from './route-handler/termbox/QueryValidator';
import InvalidRequest from './route-handler/termbox/error/InvalidRequest';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';

const app = express();
const serverBundle = fs.readFileSync( './serverDist/vue-ssr-server-bundle.json' );
const renderer = createBundleRenderer(
	JSON.parse( serverBundle.toString() ),
	{ runInNewContext: false },
);

app.get( '/termbox', ( request, response ) => {
	const termboxHandler = new TermboxHandler(
		new QueryValidator(),
	);

	termboxHandler
		.createTermboxRequest( request.query )
		.then( renderer.renderToString )
		.then( ( html ) => {
			response.send( html );
		} )
		.catch( ( err ) => {
			if ( err instanceof InvalidRequest ) {
				response.status( 400 ).send( 'Bad request' );
			} else if ( err.constructor.name === EntityNotFound.name ) { // how to instanceof?
				response.status( 404 ).send( 'Entity not found' );
			} else {
				response.status( 500 ).send( 'Technical problem ' + JSON.stringify( err ) );
			}
		} );
} );

export default app;
