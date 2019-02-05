import { GetterTree } from 'vuex';
import Language from '@/datamodel/Language';
import LanguageState from '@/store/language/LanguageState';
import { NS_USER } from '@/store/namespaces';
import { InitializedRootState } from '@/store/Root';

export const getters: GetterTree<LanguageState, any> = {
	getByCode: ( state: LanguageState ) => ( code: string ): Language | null => {
		return state.languages[ code ] || null;
	},

	getTranslationInUserLanguage: ( state: LanguageState, _getters: any, rootState: InitializedRootState ) =>
		( languageCode: string ): string => {
			const userLanguageCode = rootState[ NS_USER ].primaryLanguage;
			const translations = state.translations[ userLanguageCode ];
			if ( !translations ) {
				return languageCode;
			}
			return translations[ languageCode ] || languageCode;
		},
};
