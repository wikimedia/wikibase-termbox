import { ActionContext } from 'vuex';
import { LANGUAGE_INIT, ENSURE_AVAILABLE_IN_LANGUAGE } from './actionTypes';
import {
	LANGUAGE_TRANSLATION_UPDATE,
	LANGUAGE_UPDATE,
} from './mutationTypes';
import LanguageState from '@/store/language/LanguageState';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageCollection from '@/datamodel/LanguageCollection';
import LanguageRepository from '@/common/data-access/LanguageRepository';
import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export default (
	languageRepository: LanguageRepository,
	languageTranslationRepository: LanguageTranslationRepository,
) => ( {
	[ LANGUAGE_INIT ]( context: ActionContext<LanguageState, any> ): Promise<void> {
		return languageRepository.getLanguages()
			.then( ( languages: LanguageCollection ) => {
				context.commit( LANGUAGE_UPDATE, languages );
			} );
	},

	[ ENSURE_AVAILABLE_IN_LANGUAGE ](
		context: ActionContext<LanguageState, any>,
		inLanguage: string,
	): Promise<void> {
		return languageTranslationRepository
			.getLanguagesInLanguage( inLanguage )
			.then( ( translations: LanguageTranslations ) => {
				context.commit( LANGUAGE_TRANSLATION_UPDATE, translations );
			} );
	},
} );
