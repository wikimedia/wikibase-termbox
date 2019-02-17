import { GetterTree } from 'vuex';
import User from '@/store/user/User';
import { USER_TOP_SECONDARY_LANGUAGES_LIMIT } from '@/common/constants';

export const getters: GetterTree<User, any> = {
	primaryLanguage( state: User ) {
		return state.primaryLanguage;
	},

	topSecondaryLanguages( state: User ) {
		return state.secondaryLanguages.slice( 0, USER_TOP_SECONDARY_LANGUAGES_LIMIT );
	},
};
