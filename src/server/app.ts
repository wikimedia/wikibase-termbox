import { resolve } from 'path';
import express, { Request, Response } from 'express';
import { createBundleRenderer } from 'vue-server-renderer';
import TermboxHandler from './route-handler/termbox/TermboxHandler';
import QueryValidator from './route-handler/termbox/QueryValidator';
import InvalidRequest from './route-handler/termbox/error/InvalidRequest';
import HttpStatus from 'http-status-codes';
import BundleBoundaryPassingException, { ErrorReason } from './exceptions/BundleBoundaryPassingException';
import BundleRendererServices from './bundle-renderer/BundleRendererServices';
import BundleRendererContextBuilder from './bundle-renderer/BundleRendererContextBuilder';

export default ( services: BundleRendererServices ) => {

	const app = express();
	const renderer = createBundleRenderer(
		resolve( './serverDist/vue-ssr-server-bundle.json' ),
		{ runInNewContext: false },
	);
	const contextBuilder = new BundleRendererContextBuilder( services );

	app.get( '/termbox', ( request: Request, response: Response ) => {

		const termboxHandler = new TermboxHandler(
			new QueryValidator(),
		);

		termboxHandler.createTermboxRequest( request.query )
			.then( contextBuilder.passRequest.bind( contextBuilder ) )
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
					} else if ( err.reason === ErrorReason.LanguageNotFound ) {
						response.status( HttpStatus.BAD_REQUEST ).send( 'Bad request. Language not existing' );
					}
				} else {
					response.status( HttpStatus.INTERNAL_SERVER_ERROR ).send( 'Technical problem' );
					services.logger.log( err );
				}
			} );
	} );

	return app;
};
