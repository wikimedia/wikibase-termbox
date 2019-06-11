import CoercingQueryValidator from '@/server/route-handler/termbox/CoercingQueryValidator';

describe( 'CoercingQueryValidator', () => {

	it( 'uses the OpenAPI coercer and validator to coerce and validate a given query', () => {
		const request = new ( jest.fn() )();
		const coercer = { coerce: jest.fn() };
		const validatorResult = new ( jest.fn() )();
		const validator = { validate: jest.fn().mockReturnValue( validatorResult ) };

		const result = ( new CoercingQueryValidator( coercer, validator ) ).coerceAndValidate( request );

		expect( result ).toBe( validatorResult );
		expect( coercer.coerce ).toHaveBeenCalledWith( request );
		expect( validator.validate ).toHaveBeenCalledWith( request );
	} );

} );
