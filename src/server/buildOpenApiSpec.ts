import openApiSpec from '@/../openapi.json';
import qs from 'querystring';
import TermboxQueryValidator from './route-handler/termbox/TermboxQueryValidator';
import InvalidRequest from './route-handler/termbox/error/InvalidRequest';

export default function buildOpenApiSpec( healthCheckQuery: string|null, validator: TermboxQueryValidator ) {
	if ( !healthCheckQuery ) {
		return openApiSpec;
	}

	const query = qs.parse( healthCheckQuery );
	// TODO: this cloning is needed because the validator actually also parses and mutates the query.
	const rejection = validator.validate( { query: JSON.parse( JSON.stringify( query ) ) } );
	if ( rejection ) {
		throw new InvalidRequest( 'Request errors', rejection.errors );

	}
	openApiSpec.paths[ '/termbox' ].get[ 'x-monitor' ] = true;
	openApiSpec.paths[ '/termbox' ].get[ 'x-amples' ] = [ {
		title: 'get rendered termbox',
		request: {
			query,
			response: {
				status: 200,
				headers: { 'content-type': 'text/html' },
			},
		},
	} ];

	return openApiSpec;
}
