import MWCookieUserPreferenceRepository from '@/client/data-access/MWCookieUserPreferenceRepository';
import { UserPreference } from '@/common/UserPreference';

describe( 'MWCookieUserPreferenceRepository', () => {

	it( 'sets a cookie when calling setPreference', () => {
		const mwCookie = { set: jest.fn() };
		const cookieName = 'show-anon-edit-warning';
		const cookieOptions = { expires: 60 * 60 * 24 * 265 };
		const repo = new MWCookieUserPreferenceRepository( mwCookie as any, cookieName, cookieOptions );
		const value = 'yes';

		return repo.setPreference( UserPreference.HIDE_ANON_EDIT_WARNING, value ).then( () => {
			expect( mwCookie.set ).toHaveBeenCalledWith( cookieName, value, cookieOptions );
		} );
	} );

	it( 'gets the value from the cookie when calling getPreference', () => {
		const expectedValue = 'yes';
		const mwCookie = { get: jest.fn().mockReturnValue( expectedValue ) };
		const cookieName = 'show-anon-edit-warning';
		const repo = new MWCookieUserPreferenceRepository( mwCookie as any, cookieName );

		return repo.getPreference( UserPreference.HIDE_ANON_EDIT_WARNING ).then( ( value ) => {
			expect( value ).toBe( expectedValue );
			expect( mwCookie.get ).toHaveBeenCalledWith( cookieName );
		} );
	} );

} );
