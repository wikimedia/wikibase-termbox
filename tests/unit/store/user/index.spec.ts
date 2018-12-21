import createUser from '@/store/user';

describe( 'store/user/index', () => {
	it( 'creates a user store', () => {
		const module = createUser();
		expect( module.state ).toEqual( {
			primaryLanguage: '',
		} );
	} );
} );
