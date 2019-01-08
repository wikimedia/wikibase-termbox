import { action, mutation } from '@/store/util';

describe( 'util', () => {

	it( 'action', () => {
		expect( action( 'foo', 'bar' ) ).toBe( 'foo/bar' );
		expect( action( 'foo', 'bar', 'baz' ) ).toBe( 'foo/bar/baz' );
	} );

	it( 'mutation', () => {
		expect( mutation( 'omg', 'wtf' ) ).toBe( 'omg/wtf' );
		expect( mutation( 'omg', 'wtf', 'bbq' ) ).toBe( 'omg/wtf/bbq' );
	} );

} );
