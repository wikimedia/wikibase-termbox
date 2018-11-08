import { GetterTree } from 'vuex';
import User from '@/store/user/User';

export const getters: GetterTree<User, any> = {
	primaryLanguage( state: User ) {
		return state.primaryLanguage;
	},
};
