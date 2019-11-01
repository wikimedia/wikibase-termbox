import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import WikibaseContentLanguagesRepo, { WikibaseApiContentLanguages } from './WikibaseContentLanguagesRepo';

export default class ContentLanguagesLanguageTranslationRepo implements LanguageTranslationRepository {
	private languagesRepo: WikibaseContentLanguagesRepo;

	public constructor( languageRepo: WikibaseContentLanguagesRepo ) {
		this.languagesRepo = languageRepo;
	}

	public getLanguagesInLanguage( inLanguage: string ): Promise<LanguageTranslations> {
		return this.languagesRepo.getContentLanguages( inLanguage )
			.then( ( contentLanguages: WikibaseApiContentLanguages ) => {
				const translations: LanguageTranslations = { [ inLanguage ]: {} };
				Object.entries( contentLanguages ).forEach( ( [ languageCode, language ] ) => {
					if ( !this.isNamedLanguage( language ) ) {
						throw new TechnicalProblem( 'Name for a language not given.' );
					}

					translations[ inLanguage ][ languageCode ] = language.name;
				} );

				return translations;
			} );
	}

	private isNamedLanguage( language: unknown ): language is { name: string } {
		return language &&
			typeof language === 'object' &&
			language !== null &&
			'name' in language;
	}
}
