import formDataRequestTransformation from '@/client/axios/formDataRequestTransformation';

describe( 'formDataRequestTransformation', () => {

	it( 'transforms request data to FormData', () => {
		const formData = formDataRequestTransformation( {
			foo: 'bar',
			omg: 'bbq',
		} );

		expect( formData ).toBeInstanceOf( FormData );
		expect( ( formData as FormData ).get( 'foo' ) ).toBe( 'bar' );
		expect( ( formData as FormData ).get( 'omg' ) ).toBe( 'bbq' );
	} );

	it.each( [
		'string',
		[ 'much', 'data' ],
		null,
	] )( 'leaves non-object (%o) request data unmodified', ( nonObject ) => {
		expect( formDataRequestTransformation( nonObject ) ).toBe( nonObject );
	} );

} );
