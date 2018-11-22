import { Module } from 'vuex';
import User from '@/store/user/User';
import { actions } from '@/store/user/actions';
import { getters } from '@/store/user/getters';
import { mutations } from '@/store/user/mutations';

const state: User = {
	primaryLanguage: '',
};

const namespaced: boolean = true;

export const user: Module<User, any> = {
	namespaced,
	state,
	actions,
	getters,
	mutations,
};
