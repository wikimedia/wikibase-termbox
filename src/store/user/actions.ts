import { ActionContext, ActionTree } from 'vuex';
import { LANGUAGE_PREFERENCE } from './actionTypes';
import { LANGUAGE_INIT } from './mutationTypes';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import User from '@/store/user/User';
import {
	NS_LANGUAGE,
	NS_MESSAGES,
} from '@/store/namespaces';
import { ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';

export const actions: ActionTree<User, any> = {

	[ LANGUAGE_PREFERENCE ]( context: ActionContext<User, any>, language: string ): Promise<[void, void]> {
		context.commit( LANGUAGE_INIT, language );

		return Promise.all( [
			context.dispatch( `${NS_MESSAGES}/${MESSAGES_INIT}`, language, { root: true } ),
			context.dispatch( `${NS_LANGUAGE}/${ENSURE_AVAILABLE_IN_LANGUAGE}`, language, { root: true } ),
		] );
	},
};
