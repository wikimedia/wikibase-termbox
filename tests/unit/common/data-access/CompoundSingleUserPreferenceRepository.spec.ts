import CompoundUserPreferenceRepository from '@/common/data-access/CompoundUserPreferenceRepository';

describe( 'CompoundSingleUserPreferenceRepository', () => {

	it( 'delegates to the reading repository for getPreference', () => {
		const expectedValue = 'hello';
		const readingRepo = {
			getPreference: jest.fn().mockResolvedValue( expectedValue ),
		};
		const repo = new CompoundUserPreferenceRepository( readingRepo, new ( jest.fn() )() );

		return repo.getPreference().then( ( result ) => {
			expect( result ).toBe( expectedValue );
			expect( readingRepo.getPreference ).toHaveBeenCalled();
		} );
	} );

	it( 'delegates to the writing repository for setPreference', () => {
		const setValue = 'hello';
		const writingRepo = {
			setPreference: jest.fn().mockReturnValue( Promise.resolve() ),
		};
		const repo = new CompoundUserPreferenceRepository( new ( jest.fn() )(), writingRepo );

		return repo.setPreference( setValue ).then( () => {
			expect( writingRepo.setPreference ).toHaveBeenCalledWith( setValue );
		} );
	} );

} );
