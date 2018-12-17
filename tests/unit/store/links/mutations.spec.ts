import { mutations } from '@/store/links/mutations';
import LinksState from '@/store/links/LinksState';
import { EDIT_LINK_URL_UPDATE } from '@/store/links/mutationTypes';

describe( 'mutations', () => {

	it( EDIT_LINK_URL_UPDATE, () => {
		const state: LinksState = { editLinkUrl: '' };
		const url = '/link/to/edit/Q123';
		mutations[ EDIT_LINK_URL_UPDATE ]( state, url );

		expect( state.editLinkUrl ).toBe( url );
	} );

} );
