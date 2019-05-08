import getMwUserAgentString from '@/server/axios/getMwUserAgentString';

describe( 'getMwUserAgentString', () => {
	it( 'builds a user agent string', () => {
		const result = getMwUserAgentString( {
			name: 'my lib',
			version: '9000',
			author: 'me',
			dependencies: {
				axios: '4711',
			},
		} );

		expect( result ).toBe( 'my lib/9000 (me) axios/4711' );
	} );
} );
