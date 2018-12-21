import { Module } from 'vuex';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import LanguageState from '@/store/language/LanguageState';

export default function (): Module<LanguageState, any> {
	const state: LanguageState = {
		translations: {},
		languages: {},
	};

	const namespaced = true;

	return {
		namespaced,
		actions,
		state,
		getters,
		mutations,
	};
}
