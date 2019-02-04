import { ActionContext, ActionTree } from 'vuex';
import { LANGUAGE_PREFERENCE } from './actionTypes';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
} from './mutationTypes';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import User from '@/store/user/User';
import {
	NS_LANGUAGE,
	NS_MESSAGES,
} from '@/store/namespaces';
import { ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';
import { action } from '@/store/util';

export const actions: ActionTree<User, any> = {

	[ LANGUAGE_PREFERENCE ](
		context: ActionContext<User, any>,
		{ primaryLanguage, preferredLanguages },
	): Promise<[void, void]> {
		context.commit( LANGUAGE_INIT, primaryLanguage );

		context.commit( SECONDARY_LANGUAGES_INIT, preferredLanguages.filter( ( languageKey: string ) => {
			return languageKey !== primaryLanguage;
		} ).splice( 0, 4 ) );

		return Promise.all( [
			context.dispatch( action( NS_MESSAGES, MESSAGES_INIT ), primaryLanguage, { root: true } ),
			context.dispatch( action( NS_LANGUAGE, ENSURE_AVAILABLE_IN_LANGUAGE ), primaryLanguage, { root: true } ),
		] );
	},
};
