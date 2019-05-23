import TermboxQueryValidator from '@/server/route-handler/termbox/TermboxQueryValidator';

describe( 'TermboxQueryValidator', () => {

	it( 'uses the OpenAPI coercer and validator to validate a given query', () => {
		const request = new ( jest.fn() )();
		const coercer = { coerce: jest.fn() };
		const validatorResult = new ( jest.fn() )();
		const validator = { validate: jest.fn().mockReturnValue( validatorResult ) };

		const result = ( new TermboxQueryValidator( coercer, validator ) ).validate( request );

		expect( result ).toBe( validatorResult );
		expect( coercer.coerce ).toHaveBeenCalledWith( request );
		expect( validator.validate ).toHaveBeenCalledWith( request );
	} );

} );
