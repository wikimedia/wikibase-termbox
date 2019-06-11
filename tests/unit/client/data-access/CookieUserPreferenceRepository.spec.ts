import CookieUserPreferenceRepository from '@/client/data-access/CookieUserPreferenceRepository';

describe( 'CookieUserPreferenceRepository', () => {

	it( 'sets a cookie when calling setPreference', () => {
		const cookieStore = { set: jest.fn() };
		const cookieName = 'show-anon-edit-warning';
		const cookieOptions = { maxAge: 60 * 60 * 24 * 365 };
		const repo = new CookieUserPreferenceRepository<string>( cookieStore as any, cookieName, cookieOptions );
		const value = 'yes';

		return repo.setPreference( value ).then( () => {
			expect( cookieStore.set ).toHaveBeenCalledWith( cookieName, value, cookieOptions );
		} );
	} );

	it( 'gets the value from the cookie when calling getPreference', () => {
		const expectedValue = 'yes';
		const cookieStore = { get: jest.fn().mockReturnValue( expectedValue ) };
		const cookieName = 'show-anon-edit-warning';
		const defaultValue = 'hello';
		const repo = new CookieUserPreferenceRepository<string>( cookieStore as any, cookieName, {}, defaultValue );

		return repo.getPreference().then( ( value ) => {
			expect( value ).toBe( expectedValue );
			expect( cookieStore.get ).toHaveBeenCalledWith( cookieName, defaultValue );
		} );
	} );

} );
