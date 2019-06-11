import { GetterTree } from 'vuex';
import User from '@/store/user/User';

export const getters: GetterTree<User, any> = {
	isAnonymous: ( state: User ): boolean => {
		return state.name === null;
	},
};
