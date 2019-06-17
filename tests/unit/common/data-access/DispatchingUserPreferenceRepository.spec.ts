import DispatchingUserPreferenceRepository from '@/common/data-access/DispatchingUserPreferenceRepository';
import { UserPreference } from '@/common/UserPreference';

function newDispatchingUserPreferenceRepository( mapping: any ) {
	return new DispatchingUserPreferenceRepository( mapping );
}

describe( 'DispatchingUserPreferenceRepository', () => {

	it( 'dispatches getPreference to the corresponding repository', () => {
		const preference = UserPreference.HIDE_ANON_EDIT_WARNING;
		const expectedValue = 'some';
		const singlePreferenceRepo = {
			getPreference: jest.fn().mockResolvedValue( expectedValue ),
		};
		const repo = newDispatchingUserPreferenceRepository( {
			[ preference ]: singlePreferenceRepo,
		} );

		return repo.getPreference( preference ).then( ( value ) => {
			expect( singlePreferenceRepo.getPreference ).toHaveBeenCalled();
			expect( value ).toBe( expectedValue );
		} );
	} );

	it( 'dispatches setPreference to the corresponding repository', () => {
		const preference = UserPreference.HIDE_ANON_EDIT_WARNING;
		const value = false;
		const singlePreferenceRepo = {
			setPreference: jest.fn().mockReturnValue( Promise.resolve() ),
		};
		const repo = newDispatchingUserPreferenceRepository( {
			[ preference ]: singlePreferenceRepo,
		} );

		return repo.setPreference( preference, value ).then( () => {
			expect( singlePreferenceRepo.setPreference ).toHaveBeenCalledWith( value );
		} );
	} );

} );
