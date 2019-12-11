import openApiJson from '@/../openapi.json';
import qs from 'querystring';
import CoercingQueryValidator from './route-handler/termbox/CoercingQueryValidator';
import InvalidRequest from './route-handler/termbox/error/InvalidRequest';
import { Document } from '@/types/server/ServiceCheckerEnabledOpenApiV3';

export default function buildOpenApiSpec(
	healthCheckQuery: string|null,
	validator: CoercingQueryValidator,
): Document {
	const openApiSpec = openApiJson as Document;

	// just pass through if nothing to change (b/c no healthCheckQuery given)
	// or the base (/termbox GET) for the change we are about to apply went missing from openApiSpec
	if ( !healthCheckQuery || !openApiSpec.paths[ '/termbox' ].get ) {
		return openApiSpec;
	}

	const query = qs.parse( healthCheckQuery );
	// Cloning the parsed query object is necessary because we do not want it to be coerced. The health check service
	// expects an unmodified parsed query string.
	const rejection = validator.coerceAndValidate( { query: JSON.parse( JSON.stringify( query ) ) } );
	if ( rejection ) {
		throw new InvalidRequest( rejection.errors );
	}

	openApiSpec.paths[ '/termbox' ].get[ 'x-monitor' ] = true;
	openApiSpec.paths[ '/termbox' ].get[ 'x-amples' ] = [ {
		title: 'get rendered termbox',
		request: {
			query,
		},
		response: {
			status: 200,
			headers: { 'content-type': 'text/html' },
		},
	} ];

	return openApiSpec;
}
