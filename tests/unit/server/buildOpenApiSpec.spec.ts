import openApiSpec from '@/../openapi.json';
import buildOpenApiSpec from '@/server/buildOpenApiSpec';
import InvalidRequest from '@/server/route-handler/termbox/error/InvalidRequest';
import CoercingQueryValidator from '@/server/route-handler/termbox/CoercingQueryValidator';
import OpenAPIRequestCoercer from 'openapi-request-coercer';
import OpenAPIRequestValidator from 'openapi-request-validator';

describe( 'buildOpenApiSpec', () => {

	it( 'returns the unmodified openapi.json without a healthCheckQuery', () => {
		const validator = { coerceAndValidate: jest.fn() };
		const spec = buildOpenApiSpec( null, validator as any );
		expect( spec ).toBe( openApiSpec );
	} );

	it( 'sets x-amples and x-monitor given a valid healthCheckQuery', () => {
		const validator = { coerceAndValidate: jest.fn() };
		const language = 'de';
		const entity = 'Q123';
		const revision = '3';
		const editLink = '/edit/Q123';
		const preferredLanguages = 'de|en';

		const spec = buildOpenApiSpec(
			`language=${language}`
				+ `&entity=${entity}`
				+ `&revision=${revision}`
				+ `&editLink=${editLink}`
				+ `&preferredLanguages=${preferredLanguages}`,
			validator as any,
		);

		const termboxRouteSpec = spec.paths[ '/termbox' ].get!;

		expect( termboxRouteSpec[ 'x-monitor' ] ).toBeTruthy();
		expect( termboxRouteSpec[ 'x-amples' ] ).not.toBeUndefined();

		const xAmples = termboxRouteSpec[ 'x-amples' ]![ 0 ]!;
		expect( xAmples.title ).not.toBeUndefined();
		expect( xAmples.request ).toEqual( {
			query: {
				language,
				entity,
				revision,
				editLink,
				preferredLanguages,
			},
		} );
		expect( xAmples.response ).toEqual( {
			status: 200,
			headers: { 'content-type': 'text/html' },
		} );
	} );

	it( 'sets x-amples correctly with a real validator', () => {
		const termboxSpecParameters = openApiSpec.paths[ '/termbox' ].get.parameters;
		const termboxQueryValidator = new CoercingQueryValidator(
			new OpenAPIRequestCoercer( {
				parameters: termboxSpecParameters,
			} ),
			new OpenAPIRequestValidator( {
				parameters: termboxSpecParameters,
			} ),
		);

		const language = 'de';
		const entity = 'Q123';
		const revision = '3';
		const editLink = '/edit/Q123';
		const preferredLanguages = 'de|en';

		const spec = buildOpenApiSpec(
			`language=${language}`
			+ `&entity=${entity}`
			+ `&revision=${revision}`
			+ `&editLink=${editLink}`
			+ `&preferredLanguages=${preferredLanguages}`,
			termboxQueryValidator,
		);

		const termboxRouteSpec = spec.paths[ '/termbox' ].get!;

		expect( termboxRouteSpec[ 'x-monitor' ] ).toBeTruthy();
		expect( termboxRouteSpec[ 'x-amples' ] ).not.toBeUndefined();

		const xAmples = termboxRouteSpec[ 'x-amples' ]![ 0 ]!;
		expect( xAmples.title ).not.toBeUndefined();
		expect( xAmples.request ).toEqual( {
			query: {
				language,
				entity,
				revision,
				editLink,
				preferredLanguages,
			},
		} );
		expect( xAmples.response ).toEqual( {
			status: 200,
			headers: { 'content-type': 'text/html' },
		} );
	} );

	it( 'throws an exception given an invalid healthCheckQuery', () => {
		const errors = [
			{ path: 'revision', message: 'should have required property "revision"' },
		];
		const validator = {
			coerceAndValidate: () => ( {
				code: 400,
				errors,
			} ),
		};

		try {
			buildOpenApiSpec( 'wrong=query&validator=sad', validator as any );
			expect( false ).toBe( true ); // expected exception did not happen
		} catch ( e_ ) {
			expect( e_ ).toBeInstanceOf( InvalidRequest );
			const e = e_ as InvalidRequest;
			expect( e.getContext() ).toEqual( { message: e.message, errors } );
		}
	} );

} );
