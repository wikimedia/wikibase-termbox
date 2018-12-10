import fs from 'fs';
import express from 'express';
import { createBundleRenderer } from 'vue-server-renderer';
import TermboxHandler from './route-handler/termbox/TermboxHandler';
import QueryValidator from './route-handler/termbox/QueryValidator';
import InvalidRequest from './route-handler/termbox/error/InvalidRequest';
import HttpStatus from 'http-status-codes';
import BundleBoundaryPassingException, { ErrorReason } from '@/common/exceptions/BundleBoundaryPassingException';

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
				response.status( HttpStatus.BAD_REQUEST ).send( 'Bad request' );
			} else if ( err.constructor.name === BundleBoundaryPassingException.name ) {
				if ( err.reason === ErrorReason.EntityNotFound ) {
					response.status( HttpStatus.NOT_FOUND ).send( 'Entity not found' );
				}
			} else {
				response.status( HttpStatus.INTERNAL_SERVER_ERROR ).send( 'Technical problem ' + JSON.stringify( err ) );
			}
		} );
} );

export default app;
