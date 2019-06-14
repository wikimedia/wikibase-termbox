import BooleanCookieStore, { truthyCookieValue } from '@/client/data-access/BooleanCookieStore';

describe( 'BooleanCookieStore', () => {

	describe( 'set', () => {
		it( 'writes a cookie with a truthy value when setting the value to true', () => {
			const cookieStore = { set: jest.fn() };
			const store = new BooleanCookieStore( cookieStore as any );
			const cookieName = 'my-boolean-cookie';

			store.set( cookieName, true, { maxAge: 3 } );

			expect( cookieStore.set ).toHaveBeenCalledWith( cookieName, truthyCookieValue, { maxAge: 3 } );
		} );

		it( 'deletes the cookie when setting the value to false', () => {
			const cookieStore = { set: jest.fn() };
			const store = new BooleanCookieStore( cookieStore as any );
			const cookieName = 'my-boolean-cookie';

			store.set( cookieName, false, { maxAge: 3 } );

			expect( cookieStore.set ).toHaveBeenCalledWith( cookieName, null, { maxAge: 3 } );
		} );
	} );

	describe( 'get', () => {
		it( 'returns false if the cookie is not set', () => {
			const cookieStore = { get: jest.fn().mockReturnValue( null ) };
			const store = new BooleanCookieStore( cookieStore as any );
			const cookieName = 'my-boolean-cookie';

			expect( store.get( cookieName ) ).toBe( false );
			expect( cookieStore.get ).toHaveBeenCalledWith( cookieName );
		} );

		it( 'returns true if the cookie is set', () => {
			const cookieStore = { get: jest.fn().mockReturnValue( truthyCookieValue ) };
			const store = new BooleanCookieStore( cookieStore as any );
			const cookieName = 'my-boolean-cookie';

			expect( store.get( cookieName ) ).toBe( true );
			expect( cookieStore.get ).toHaveBeenCalledWith( cookieName );
		} );
	} );

} );
