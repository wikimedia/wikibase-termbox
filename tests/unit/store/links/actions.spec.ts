import { LINKS_INIT } from '@/store/links/actionTypes';
import { LINKS_UPDATE } from '@/store/links/mutationTypes';
import { actions } from '@/store/links/actions';
import TermboxLinks from '@/common/TermboxLinks';
import newMockStore from '@wmde/vuex-helpers/dist/newMockStore';

describe( 'links/actions', () => {
	describe( LINKS_INIT, () => {
		it( 'commits the url provided and returns a resolved promise', () => {
			const links: TermboxLinks = { editLinkUrl: '/edit/Q123', loginLinkUrl: '/login', signUpLinkUrl: '/signUp' };
			const store = newMockStore( {
				commit: jest.fn(),
			} );

			actions[ LINKS_INIT ]( store, links );
			expect( store.commit ).toHaveBeenCalledWith( LINKS_UPDATE, links );
		} );
	} );

} );
