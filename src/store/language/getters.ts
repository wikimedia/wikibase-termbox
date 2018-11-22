import { GetterTree } from 'vuex';
import Language from '@/datamodel/Language';
import LanguageState from '@/store/language/LanguageState';

export const getters: GetterTree<LanguageState, any> = {
	getByCode: ( state: LanguageState ) => ( code: string ): Language | null => {
		return state.languages[ code ] || null;
	},

	getTranslationByCode: ( state: LanguageState ) =>
		( code: string, inLanguage: string ): string | null => {
			const translations = state.translations[ inLanguage ];
			if ( !translations ) {
				return null;
			}
			return translations[ code ] || null;
		},
};
