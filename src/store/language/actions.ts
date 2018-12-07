import { ActionContext, ActionTree } from 'vuex';
import { LANGUAGE_INIT, ENSURE_AVAILABLE_IN_LANGUAGE } from './actionTypes';
import {
	LANGUAGE_TRANSLATION_UPDATE,
	LANGUAGE_UPDATE,
} from './mutationTypes';
import { factory } from '@/common/TermboxFactory';
import LanguageState from '@/store/language/LanguageState';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageCollection from '@/datamodel/LanguageCollection';

export const actions: ActionTree<LanguageState, any> = {

	[ LANGUAGE_INIT ]( context: ActionContext<LanguageState, any> ): Promise<void> {
		// TODO commit dynamic list from upstream source
		// TODO same api. how to do only one call?
		context.commit( LANGUAGE_UPDATE, {
			en: {
				code: 'en',
				directionality: 'ltr',
			},
			de: {
				code: 'de',
				directionality: 'ltr',
			},
			ar: {
				code: 'ar',
				directionality: 'rtl',
			},
		} as LanguageCollection );

		return Promise.resolve();
	},

	[ ENSURE_AVAILABLE_IN_LANGUAGE ]( context: ActionContext<LanguageState, any>, inLanguage: string ): Promise<void> {
		return factory.getLanguageTranslationRepository()
			.getLanguagesInLanguage( inLanguage )
			.then( ( translations: LanguageTranslations ) => {
				context.commit( LANGUAGE_TRANSLATION_UPDATE, translations );
			} );
	},

};
