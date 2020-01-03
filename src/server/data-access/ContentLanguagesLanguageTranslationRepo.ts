import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import WikibaseContentLanguagesRepo from './WikibaseContentLanguagesRepo';

export default class ContentLanguagesLanguageTranslationRepo implements LanguageTranslationRepository {
	private languagesRepo: WikibaseContentLanguagesRepo;

	public constructor( languageRepo: WikibaseContentLanguagesRepo ) {
		this.languagesRepo = languageRepo;
	}

	public getLanguagesInLanguage( inLanguage: string ): Promise<LanguageTranslations> {
		return this.languagesRepo.getContentLanguages( inLanguage )
			.then( ( contentLanguages ) => {
				const translations: LanguageTranslations = { [ inLanguage ]: {} };
				Object.entries( contentLanguages ).forEach( ( [ languageCode, language ] ) => {
					translations[ inLanguage ][ languageCode ] = language.name;
				} );

				return translations;
			} );
	}
}
