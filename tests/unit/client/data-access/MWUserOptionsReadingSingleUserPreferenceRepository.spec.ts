import MWUserOptionsReadingSingleUserPreferenceRepository
	from '@/client/data-access/MWUserOptionsReadingSingleUserPreferenceRepository';

describe( 'MWUserOptionsReadingSingleUserPreferenceRepository', () => {

	it( 'delegates to the injected mw.user.options service for getPreference', () => {
		const option = 'favorite-vegetable';
		const expectedValue = 'potato';
		const mwUserOptions = {
			get: jest.fn().mockReturnValue( expectedValue ),
		};
		const repo = new MWUserOptionsReadingSingleUserPreferenceRepository( option, mwUserOptions );

		return repo.getPreference().then( ( result ) => {
			expect( result ).toBe( expectedValue );
			expect( mwUserOptions.get ).toHaveBeenCalledWith( option );
		} );
	} );

} );
