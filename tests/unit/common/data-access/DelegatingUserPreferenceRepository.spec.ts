import DelegatingUserPreferenceRepository from '@/common/data-access/DelegatingUserPreferenceRepository';

describe( 'DelegatingUserPreferenceRepository', () => {

	it( 'delegates to first repo if instructed to', () => {
		const value = 'some';
		const repoOne = {
			getPreference: jest.fn().mockResolvedValue( value ),
			setPreference: jest.fn(),
		};
		const repo = new DelegatingUserPreferenceRepository(
			repoOne,
			new ( jest.fn() )(),
			true,
		);

		repo.setPreference( value );
		return repo.getPreference().then( ( actualValue: string ) => {
			expect( actualValue ).toBe( value );

			expect( repoOne.setPreference ).toHaveBeenCalledWith( value );
		} );
	} );

	it( 'delegates to second repo if instructed to', () => {
		const value = 'other';
		const repoTwo = {
			getPreference: jest.fn().mockResolvedValue( value ),
			setPreference: jest.fn(),
		};
		const repo = new DelegatingUserPreferenceRepository(
			new ( jest.fn() )(),
			repoTwo,
			false,
		);

		repo.setPreference( value );
		return repo.getPreference().then( ( actualValue: string ) => {
			expect( actualValue ).toBe( value );

			expect( repoTwo.setPreference ).toHaveBeenCalledWith( value );
		} );
	} );

} );
