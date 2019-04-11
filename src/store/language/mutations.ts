import { MutationTree } from 'vuex';
import {
	LANGUAGE_TRANSLATION_UPDATE,
	LANGUAGE_UPDATE,
} from './mutationTypes';
import LanguageState from '@/store/language/LanguageState';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageCollection from '@/datamodel/LanguageCollection';

export const mutations: MutationTree<LanguageState> = {
	[ LANGUAGE_UPDATE ]( state: LanguageState, languages: LanguageCollection ): void {
		state.languages = { ...state.languages, ...languages };
	},

	[ LANGUAGE_TRANSLATION_UPDATE ]( state: LanguageState, translations: LanguageTranslations ): void {
		state.translations = { ...state.translations, ...translations };
	},
};
