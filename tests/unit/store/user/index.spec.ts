import createUser from '@/store/user';

describe( 'store/user/index', () => {
	it( 'creates a user store', () => {
		const mockUserConfiguration = {
			isEnabled: jest.fn(),
		};
		const module = createUser( {} as any, mockUserConfiguration );
		expect( module.state ).toEqual( {
			name: null,
			primaryLanguage: '',
			secondaryLanguages: [],
			preferences: {},
		} );
	} );
	it( 'tempUserEnabled returns false if not set', () => {
		const mockUserConfiguration = {
			isEnabled: jest.fn().mockImplementation( () => false ),
		};
		const module = createUser( {} as any, mockUserConfiguration );
		expect( module.state ).toEqual( {
			name: null,
			primaryLanguage: '',
			secondaryLanguages: [],
			preferences: {},
			tempUserEnabled: false,
		} );
	} );
	it( 'tempUserEnabled returns true if set', () => {
		const mockUserConfiguration = {
			isEnabled: jest.fn().mockImplementation( () => true ),
		};
		const module = createUser( {} as any, mockUserConfiguration );
		expect( module.state ).toEqual( {
			name: null,
			primaryLanguage: '',
			secondaryLanguages: [],
			preferences: {},
			tempUserEnabled: true,
		} );
	} );
} );
