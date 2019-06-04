import BooleanMWCookieStore, { truthyCookieValue } from '@/client/data-access/BooleanMWCookieStore';

describe( 'BooleanMWCookieStore', () => {

	describe( 'set', () => {
		it( 'writes a cookie with a truthy value when setting the value to true', () => {
			const mwCookie = { set: jest.fn() };
			const store = new BooleanMWCookieStore( mwCookie as any );
			const cookieName = 'my-boolean-cookie';

			store.set( cookieName, true, { maxAge: 3 } );

			expect( mwCookie.set ).toHaveBeenCalledWith( cookieName, truthyCookieValue, { expires: 3 } );
		} );

		it( 'deletes the cookie when setting the value to false', () => {
			const mwCookie = { set: jest.fn() };
			const store = new BooleanMWCookieStore( mwCookie as any );
			const cookieName = 'my-boolean-cookie';

			store.set( cookieName, false, { maxAge: 3 } );

			expect( mwCookie.set ).toHaveBeenCalledWith( cookieName, null );
		} );
	} );

	describe( 'get', () => {
		it( 'returns false if the cookie is not set', () => {
			const mwCookie = { get: jest.fn().mockReturnValue( null ) };
			const store = new BooleanMWCookieStore( mwCookie as any );
			const cookieName = 'my-boolean-cookie';

			expect( store.get( cookieName ) ).toBe( false );
			expect( mwCookie.get ).toHaveBeenCalledWith( cookieName );
		} );

		it( 'returns true if the cookie is set', () => {
			const mwCookie = { get: jest.fn().mockReturnValue( truthyCookieValue ) };
			const store = new BooleanMWCookieStore( mwCookie as any );
			const cookieName = 'my-boolean-cookie';

			expect( store.get( cookieName ) ).toBe( true );
			expect( mwCookie.get ).toHaveBeenCalledWith( cookieName );
		} );
	} );

} );
