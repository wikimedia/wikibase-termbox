import { ActionContext } from 'vuex';
import LinksState from '@/store/links/LinksState';
import { EDIT_LINK_URL_INIT } from '@/store/links/actionTypes';
import { EDIT_LINK_URL_UPDATE } from '@/store/links/mutationTypes';

export const actions = {
	[ EDIT_LINK_URL_INIT ]( store: ActionContext<LinksState, any>, editLinkUrl: string ): Promise<void> {
		store.commit( EDIT_LINK_URL_UPDATE, editLinkUrl );
		return Promise.resolve();
	},
};
