import { resolve } from 'path';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import responseTime from 'response-time';
import { createBundleRenderer } from 'vue-server-renderer';
import TermboxHandler from './route-handler/termbox/TermboxHandler';
import InvalidRequest from './route-handler/termbox/error/InvalidRequest';
import HttpStatus from 'http-status-codes';
import BundleBoundaryPassingException, { ErrorReason } from './exceptions/BundleBoundaryPassingException';
import BundleRendererServices from './bundle-renderer/BundleRendererServices';
import BundleRendererContextBuilder from './bundle-renderer/BundleRendererContextBuilder';
import inlanguage from './directives/inlanguage';
import packageInfo from '@/../package.json';
import InfoHandler from './route-handler/_info/InfoHandler';
import reportResponseTimeMetrics from './reportResponseTimeMetrics';

export default ( services: BundleRendererServices ) => {

	const app = express();

	app.use( compression() );
	app.use( responseTime( reportResponseTimeMetrics( services.metrics ) ) );

	const renderer = createBundleRenderer(
		resolve( './serverDist/vue-ssr-server-bundle.json' ),
		{
			runInNewContext: false,
			directives: {
				inlanguage,
			},
		},
	);
	const contextBuilder = new BundleRendererContextBuilder( services );

	app.use( '/_info', InfoHandler( packageInfo ) );

	app.get( '/', ( request: Request, response: Response, next: NextFunction ) => {
		if ( request.query && Object.prototype.hasOwnProperty.call( request.query, 'spec' ) ) {
			response.json( services.openApiSpec );
		} else {
			next();
		}
	} );

	app.get( '/termbox', ( request: Request, response: Response ) => {
		const termboxHandler = new TermboxHandler( services.termboxQueryValidator );

		termboxHandler.createTermboxRequest( request )
			.then( contextBuilder.passRequest.bind( contextBuilder ) )
			.then( renderer.renderToString )
			.then( ( html ) => {
				response.send( html );
			} )
			.catch( ( err ) => {
				if ( err instanceof InvalidRequest ) {
					response.status( HttpStatus.BAD_REQUEST )
						.send( 'Bad request\nErrors: ' + JSON.stringify( err.getContext() ) );
					services.logger.log( 'info/service', err.getContext() );
				} else if ( err.constructor.name === BundleBoundaryPassingException.name ) {
					if ( err.reason === ErrorReason.EntityNotFound ) {
						response.status( HttpStatus.NOT_FOUND ).send( 'Entity not found' );
					} else if ( err.reason === ErrorReason.LanguageNotFound ) {
						response.status( HttpStatus.BAD_REQUEST ).send( 'Bad request. Language not existing' );
					}

					services.logger.log( 'info/service', err.getContext() );
				} else {
					response.status( HttpStatus.INTERNAL_SERVER_ERROR ).send( 'Technical problem' );
					services.logger.log( 'error/service', err.getContext() );
				}
			} );
	} );

	return app;
};
