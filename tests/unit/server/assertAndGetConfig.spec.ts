import assertAndGetConfig from '@/server/assertAndGetConfig';

function getMockLogger() {
	return {
		log: jest.fn(),
	};
}

describe( 'assertAndGetConfig', () => {

	it( 'exits on invalid config and logs', () => {
		const logger = getMockLogger();
		const exit = jest.spyOn( process, 'exit' ).mockImplementation();
		assertAndGetConfig(
			{
				baz: {},
			},
			{
				foo: 'bar',
			},
			logger,
		);

		expect( logger.log ).toHaveBeenCalled();
		expect( logger.log.mock.calls[ 0 ] ).toEqual( [
			'fatal/service',
			'baz env must be configured to a meaningful value. Exiting.',
		] );
		expect( exit ).toHaveBeenCalled();
	} );

	it( 'returns valid config and logs', () => {
		const logger = getMockLogger();
		const config = {
			foo: 'bar',
		};
		const result = assertAndGetConfig(
			{
				foo: {},
			},
			config,
			logger,
		);

		expect( result ).toEqual( config );

		expect( logger.log ).toHaveBeenCalled();
		expect( logger.log.mock.calls[ 0 ] ).toEqual( [ 'info/service', 'Set foo to bar' ] );
	} );

	it( 'assumes defaults', () => {
		const result = assertAndGetConfig(
			{
				lorem: {
					fallback: 'yes',
				},
			},
			{},
			getMockLogger(),
		);

		expect( result ).toEqual( {
			lorem: 'yes',
		} );
	} );

	it( 'coerces integers (only)', () => {
		const result = assertAndGetConfig(
			{
				bar: {},
				funny: {},
			},
			{
				bar: '7',
				funny: '1potato',
			},
			getMockLogger(),
		);

		expect( result ).toStrictEqual( {
			bar: 7,
			funny: '1potato',
		} );
	} );
} );
