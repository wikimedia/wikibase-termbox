import DispatchingUserPreferenceRepository from '@/common/data-access/DispatchingUserPreferenceRepository';
import { UserPreference } from '@/common/UserPreference';

function newDispatchingUserPreferenceRepository( mapping: any ) {
	return new DispatchingUserPreferenceRepository( mapping );
}

describe( 'DispatchingUserPreferenceRepository', () => {

	it( 'dispatches getPreference to the corresponding repository', () => {
		const preference = UserPreference.HIDE_ANON_EDIT_WARNING;
		const expectedValue = 'some';
		const specificPreferenceRepo = {
			getPreference: jest.fn().mockResolvedValue( expectedValue ),
		};
		const repo = newDispatchingUserPreferenceRepository( {
			[ preference ]: specificPreferenceRepo,
		} );

		return repo.getPreference( preference ).then( ( value ) => {
			expect( specificPreferenceRepo.getPreference ).toHaveBeenCalledWith( preference );
			expect( value ).toBe( expectedValue );
		} );
	} );

	it( 'dispatches setPreference to the corresponding repository', () => {
		const preference = UserPreference.HIDE_ANON_EDIT_WARNING;
		const value = 'some';
		const specificPreferenceRepo = {
			setPreference: jest.fn().mockReturnValue( Promise.resolve() ),
		};
		const repo = newDispatchingUserPreferenceRepository( {
			[ preference ]: specificPreferenceRepo,
		} );

		return repo.setPreference( preference, value ).then( () => {
			expect( specificPreferenceRepo.setPreference ).toHaveBeenCalledWith( preference, value );
		} );
	} );

} );
