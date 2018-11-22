import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import LanguageTranslations from '@/datamodel/LanguageTranslations';

export type LanguageNameInUserLangCallback = ( languageCode: string ) => string;

export default class UlsLanguageTranslationRepository implements LanguageTranslationRepository {

	private readonly getLanguageNameInUserLang: LanguageNameInUserLangCallback;

	public constructor( getLanguageNameByCode: LanguageNameInUserLangCallback ) {
		this.getLanguageNameInUserLang = getLanguageNameByCode;
	}

	public getLanguagesInLanguage( inLanguage: string ): Promise<LanguageTranslations> {
		return new Promise<LanguageTranslations>( ( resolve ) => {
			resolve( {
				[inLanguage]: {
					[inLanguage]: this.getLanguageNameInUserLang( inLanguage ),
				},
			} as LanguageTranslations );
		} );
	}

}
