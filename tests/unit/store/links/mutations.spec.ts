import { mutations } from '@/store/links/mutations';
import LinksState from '@/store/links/LinksState';
import { LINKS_UPDATE } from '@/store/links/mutationTypes';
import TermboxLinks from '@/common/TermboxLinks';

describe( 'mutations', () => {

	it( LINKS_UPDATE, () => {
		const state: LinksState = { editLinkUrl: '', loginLinkUrl: '', signUpLinkUrl: '' };
		const links: TermboxLinks = {
			editLinkUrl: '/link/to/edit/Q123',
			loginLinkUrl: '/login',
			signUpLinkUrl: '/signUp',
		};
		mutations[ LINKS_UPDATE ]( state, links );

		expect( state.editLinkUrl ).toBe( links.editLinkUrl );
		expect( state.loginLinkUrl ).toBe( links.loginLinkUrl );
		expect( state.signUpLinkUrl ).toBe( links.signUpLinkUrl );
	} );

} );
