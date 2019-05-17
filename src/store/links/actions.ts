import { ActionContext } from 'vuex';
import LinksState from '@/store/links/LinksState';
import { LINKS_INIT } from '@/store/links/actionTypes';
import { LINKS_UPDATE } from '@/store/links/mutationTypes';
import TermboxLinks from '@/common/TermboxLinks';

export const actions = {
	[ LINKS_INIT ]( store: ActionContext<LinksState, any>, links: TermboxLinks ): void {
		store.commit( LINKS_UPDATE, links );
	},
};
