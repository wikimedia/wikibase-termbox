import { ActionContext, ActionTree } from 'vuex';
import { LANGUAGE_PREFERENCE } from './actionTypes';
import { LANGUAGE_INIT } from './mutationTypes';
import User from '@/store/user/User';
import { NS_LANGUAGE } from '@/store/namespaces';
import { ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';

export const actions: ActionTree<User, any> = {

	[ LANGUAGE_PREFERENCE ]( context: ActionContext<User, any>, language: string ): Promise<void> {
		context.commit( LANGUAGE_INIT, language );

		// this would be a good place to dispatch a message translation update, too
		return context.dispatch( `${NS_LANGUAGE}/${ENSURE_AVAILABLE_IN_LANGUAGE}`, language, { root: true } );
	},

};
