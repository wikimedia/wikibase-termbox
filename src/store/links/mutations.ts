import { MutationTree } from 'vuex';
import LinksState from '@/store/links/LinksState';
import { LINKS_UPDATE } from '@/store/links/mutationTypes';
import TermboxLinks from '@/common/TermboxLinks';

export const mutations: MutationTree<LinksState> = {
	[ LINKS_UPDATE ]( state: LinksState, payload: TermboxLinks ) {
		state.editLinkUrl = payload.editLinkUrl;
		state.loginLinkUrl = payload.loginLinkUrl;
		state.signUpLinkUrl = payload.signUpLinkUrl;
	},
};
