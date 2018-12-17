import { MutationTree } from 'vuex';
import LinksState from '@/store/links/LinksState';
import { EDIT_LINK_URL_UPDATE } from '@/store/links/mutationTypes';

export const mutations: MutationTree<LinksState> = {
	[ EDIT_LINK_URL_UPDATE ]( state: LinksState, payload: string ) {
		state.editLinkUrl = payload;
	},
};
