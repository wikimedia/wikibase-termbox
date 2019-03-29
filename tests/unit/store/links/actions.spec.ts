import { EDIT_LINK_URL_INIT } from '@/store/links/actionTypes';
import { EDIT_LINK_URL_UPDATE } from '@/store/links/mutationTypes';
import { actions } from '@/store/links/actions';
import newMockStore from '../newMockStore';

describe( 'links/actions', () => {
	describe( EDIT_LINK_URL_INIT, () => {
		it( 'commits the url provided and returns a resolved promise', () => {
			const url = '/link/to/edit/Q42';
			const store = newMockStore( {
				commit: jest.fn(),
			} );

			actions[ EDIT_LINK_URL_INIT ]( store, url );
			expect( store.commit ).toHaveBeenCalledWith( EDIT_LINK_URL_UPDATE, url );
		} );
	} );

} );
