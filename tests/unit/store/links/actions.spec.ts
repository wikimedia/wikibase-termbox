import { EDIT_LINK_URL_INIT } from '@/store/links/actionTypes';
import { EDIT_LINK_URL_UPDATE } from '@/store/links/mutationTypes';
import { actions } from '@/store/links/actions';

describe( 'actions', () => {

	it( EDIT_LINK_URL_INIT, () => {
		const url = '/link/to/edit/Q42';
		const store = {
			commit: jest.fn(),
		};

		( actions[ EDIT_LINK_URL_INIT ] as any )( store, url );

		expect( store.commit ).toHaveBeenCalledWith( EDIT_LINK_URL_UPDATE, url );
	} );

} );
