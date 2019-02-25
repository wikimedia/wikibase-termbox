import { Module } from 'vuex';
import User from '@/store/user/User';
import { getters } from '@/store/user/getters';

const namespaced = false;

let state: User = {
	primaryLanguage: '',
	secondaryLanguages: [],
};

export const emptyUserType: User = state;
export const emptyUserModule: Module<User, any> = {
	namespaced,
	state,
	getters,
};

state = {
	primaryLanguage: 'de',
	secondaryLanguages: [ 'en', 'fr', 'it', 'zh', 'hu', 'dk' ],
};

export const filledUserType: User = state;
export const filledUserModule: Module<User, any> = {
	namespaced,
	state,
	getters,
};
