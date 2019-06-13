import StringMWCookieStore from '@/client/data-access/StringMWCookieStore';

describe( 'StringMWCookieStore', () => {

	describe( 'set', () => {
		it( 'writes a cookie with the string value when setting the value to a string', () => {
			const mwCookie = { set: jest.fn() };
			const store = new StringMWCookieStore( mwCookie as any );
			const cookieName = 'my-string-cookie';
			const cookieValue = 'foo';

			store.set( cookieName, cookieValue, { maxAge: 3 } );

			expect( mwCookie.set ).toHaveBeenCalledWith( cookieName, cookieValue, { expires: 3 } );
		} );

		it( 'deletes the cookie when setting the value to null', () => {
			const mwCookie = { set: jest.fn() };
			const store = new StringMWCookieStore( mwCookie as any );
			const cookieName = 'my-string-cookie';
			const cookieValue = null;

			store.set( cookieName, cookieValue, { maxAge: 3 } );

			expect( mwCookie.set ).toHaveBeenCalledWith( cookieName, cookieValue );
		} );
	} );

	describe( 'get', () => {
		it( 'returns null if the cookie is not set', () => {
			const cookieValue = null;
			const mwCookie = { get: jest.fn().mockReturnValue( cookieValue ) };
			const store = new StringMWCookieStore( mwCookie as any );
			const cookieName = 'my-string-cookie';

			expect( store.get( cookieName ) ).toBe( cookieValue );
			expect( mwCookie.get ).toHaveBeenCalledWith( cookieName );
		} );

		it( 'returns passed default value if the cookie is not set', () => {
			const defaultValue = 'fallback';
			const mwCookie = { get: jest.fn().mockReturnValue( defaultValue ) };
			const store = new StringMWCookieStore( mwCookie as any );
			const cookieName = 'my-string-cookie';

			expect( store.get( cookieName, defaultValue ) ).toBe( defaultValue );
			expect( mwCookie.get ).toHaveBeenCalledWith( cookieName, null, defaultValue );
		} );

		it( 'returns string if the cookie is set', () => {
			const cookieValue = 'foo';
			const mwCookie = { get: jest.fn().mockReturnValue( cookieValue ) };
			const store = new StringMWCookieStore( mwCookie as any );
			const cookieName = 'my-string-cookie';

			expect( store.get( cookieName ) ).toBe( cookieValue );
			expect( mwCookie.get ).toHaveBeenCalledWith( cookieName );
		} );
	} );

} );
