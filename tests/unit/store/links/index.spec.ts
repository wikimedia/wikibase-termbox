import createLinks from '@/store/links';

describe( 'store/links/index', () => {
	it( 'creates a links store', () => {
		const module = createLinks();
		expect( module.state ).toEqual( {
			editLinkUrl: '',
			loginLinkUrl: '',
			signUpLinkUrl: '',
		} );
	} );
} );
