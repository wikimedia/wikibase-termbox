import { MutationTree } from 'vuex';
import {
	LANGUAGE_TRANSLATION_UPDATE,
} from './mutationTypes';
import LanguageState from '@/store/language/LanguageState';
import LanguageTranslations from '@/datamodel/LanguageTranslations';

export const mutations: MutationTree<LanguageState> = {
	[ LANGUAGE_TRANSLATION_UPDATE ]( state: LanguageState, translations: LanguageTranslations ): void {
		Object.entries( translations ).forEach( ( [ languageKey, localTranslations ] ) => {
			state.translations[ languageKey ] = localTranslations;
		} );
	},
};
