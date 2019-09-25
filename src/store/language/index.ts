import { Module } from 'vuex';
import createActions from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import LanguageState from '@/store/language/LanguageState';
import LanguageRepository from '@/common/data-access/LanguageRepository';
import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';

export default function (
	languageRepository: LanguageRepository,
	languageTranslationRepository: LanguageTranslationRepository,
): Module<LanguageState, any> {
	const state: LanguageState = {
		translations: {},
		languages: {},
	};

	return {
		namespaced: true,
		actions: createActions(
			languageRepository,
			languageTranslationRepository,
		),
		state,
		getters,
		mutations,
	};
}
