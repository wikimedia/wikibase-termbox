import createMessages from '@/store/messages';

describe( 'store/messages/index', () => {
	it( 'creates a messages store', () => {
		const module = createMessages( {} as any );
		expect( module.state ).toEqual( {
			messages: {},
		} );
	} );
} );
