import { ActionContext } from 'vuex';
import { LANGUAGE_INIT, ENSURE_AVAILABLE_IN_LANGUAGE } from './actionTypes';
import {
	LANGUAGE_TRANSLATION_UPDATE,
	LANGUAGE_UPDATE,
} from './mutationTypes';
import { services } from '@/common/TermboxServices';
import LanguageState from '@/store/language/LanguageState';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageCollection from '@/datamodel/LanguageCollection';

export const actions = {

	[ LANGUAGE_INIT ]( context: ActionContext<LanguageState, any> ): Promise<void> {
		return services.getLanguageRepository()
			.getLanguages()
			.then( ( languages: LanguageCollection ) => {
				context.commit( LANGUAGE_UPDATE, languages );
			} );
	},

	[ ENSURE_AVAILABLE_IN_LANGUAGE ]( context: ActionContext<LanguageState, any>, inLanguage: string ): Promise<void> {
		return services.getLanguageTranslationRepository()
			.getLanguagesInLanguage( inLanguage )
			.then( ( translations: LanguageTranslations ) => {
				context.commit( LANGUAGE_TRANSLATION_UPDATE, translations );
			} );
	},

};
