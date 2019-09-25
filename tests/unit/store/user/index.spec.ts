import createUser from '@/store/user';

describe( 'store/user/index', () => {
	it( 'creates a user store', () => {
		const module = createUser( {} as any );
		expect( module.state ).toEqual( {
			name: null,
			primaryLanguage: '',
			secondaryLanguages: [],
			preferences: {},
		} );
	} );
} );
