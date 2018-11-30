import message from '@/filter/message';

describe( 'message filter', () => {
	it( 'returns hard-coded pipe value for wikibase-termbox-alias-separator', () => {
		expect( message( 'wikibase-termbox-alias-separator' ) ).toBe( '|' );
	} );

	it( 'unknown message keys result in message key', () => {
		const unknownKey = 'foo-bar-baz';
		expect( message( unknownKey ) ).toBe( unknownKey );
	} );
} );
