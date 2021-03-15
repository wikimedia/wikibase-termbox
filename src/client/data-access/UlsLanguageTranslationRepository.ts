import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import LanguageTranslations, { StringTMap } from '@/datamodel/LanguageTranslations';
import { WikibaseContentLanguages } from '@/client/mediawiki/MwWindow';

export default class UlsLanguageTranslationRepository implements LanguageTranslationRepository {

	private contentLanguages: WikibaseContentLanguages;
	public constructor( contentLanguages: WikibaseContentLanguages ) {
		this.contentLanguages = contentLanguages;
	}

	public getLanguagesInLanguage( inLanguage: string ): Promise<LanguageTranslations> {
		return new Promise<LanguageTranslations>( ( resolve ) => {
			resolve( {
				[ inLanguage ]: this.getLanguagesNames(),
			} );
		} );
	}

	private getLanguagesNames(): StringTMap<string> {
		return this.contentLanguages.getLanguageNameMap();
	}
}
