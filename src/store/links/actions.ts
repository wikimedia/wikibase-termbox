import { ActionTree } from 'vuex';
import LinksState from '@/store/links/LinksState';
import { EDIT_LINK_URL_INIT } from '@/store/links/actionTypes';
import { EDIT_LINK_URL_UPDATE } from '@/store/links/mutationTypes';

export const actions: ActionTree<LinksState, any> = {
	[ EDIT_LINK_URL_INIT ]( store, language: string ) {
		store.commit( EDIT_LINK_URL_UPDATE, language );
	},
};
