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
		Object.entries( languages ).forEach( ( [ languageKey, localData ] ) => {
			state.languages[ languageKey ] = localData;
		} );
	},

	[ LANGUAGE_TRANSLATION_UPDATE ]( state: LanguageState, translations: LanguageTranslations ): void {
		Object.entries( translations ).forEach( ( [ languageKey, localTranslations ] ) => {
			state.translations[ languageKey ] = localTranslations;
		} );
	},
};
