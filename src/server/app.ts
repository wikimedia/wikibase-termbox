import { resolve } from 'path';
import express, { Application, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import responseTime from 'response-time';
import { createBundleRenderer } from 'vue-bundle-renderer';
import { renderToString } from '@vue/server-renderer';
import * as bundleRunner from 'bundle-runner';
import TermboxHandler from './route-handler/termbox/TermboxHandler';
import InvalidRequest from './route-handler/termbox/error/InvalidRequest';
import { StatusCodes } from 'http-status-codes';
import BundleBoundaryPassingException, { ErrorReason } from './exceptions/BundleBoundaryPassingException';
import BundleRendererServices from './bundle-renderer/BundleRendererServices';
import BundleRendererContextBuilder from './bundle-renderer/BundleRendererContextBuilder';
import packageInfo from '@/../package.json';
import InfoHandler from './route-handler/_info/InfoHandler';
import reportResponseTimeMetrics from './reportResponseTimeMetrics';
import { buildErrorContextWithRequestInfo } from './buildErrorContextWithRequestInfo';

export default function ( services: BundleRendererServices ): Application {

	const app = express();

	app.use( compression() );
	app.use( responseTime( reportResponseTimeMetrics( services.metrics ) ) );

	const renderer = createBundleRenderer(
		resolve( './serverDist/vue-ssr-server-bundle.json' ),
		{
			runInNewContext: false,
			renderToString,
			bundleRunner,
			clientManifest: {},
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
			.then( ( context ) => renderer.renderToString( context as object ) )
			.then( ( { html } ) => {
				response.send( html );
			} )
			.catch( ( err ) => {
				if ( err instanceof InvalidRequest ) {
					response.status( StatusCodes.BAD_REQUEST )
						.send( `Bad request\nErrors: ${JSON.stringify( err.getContext() )}` );
					services.logger.log( 'info/service', buildErrorContextWithRequestInfo( err, request ) );
				} else if ( err.constructor.name === BundleBoundaryPassingException.name ) {
					if ( err.reason === ErrorReason.EntityNotFound ) {
						response.status( StatusCodes.NOT_FOUND ).send( 'Entity not found' );
					} else if ( err.reason === ErrorReason.LanguageNotFound ) {
						response.status( StatusCodes.BAD_REQUEST ).send( 'Bad request. Language not existing' );
					}

					services.logger.log( 'info/service', buildErrorContextWithRequestInfo( err, request ) );
				} else {
					response.status( StatusCodes.INTERNAL_SERVER_ERROR ).send( 'Technical problem' );
					services.logger.log( 'error/service', buildErrorContextWithRequestInfo( err, request ) );
				}
			} );
	} );

	return app;
}
