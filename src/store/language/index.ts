import { Module } from 'vuex';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import LanguageState from '@/store/language/LanguageState';

const state: LanguageState = {
	translations: {},
	languages: {},
};

const namespaced = true;

export const language: Module<LanguageState, any> = {
	namespaced,
	actions,
	state,
	getters,
	mutations,
};
