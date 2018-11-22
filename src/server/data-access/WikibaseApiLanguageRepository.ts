import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import LanguageTranslations from '../../datamodel/LanguageTranslations';

export default class WikibaseApiLanguageRepository implements LanguageTranslationRepository {

	public getLanguagesInLanguage( inLanguage: string ): Promise<LanguageTranslations> {
		return new Promise<LanguageTranslations>( ( resolve ) => {
			resolve( {
				de: {
					de: 'Deutsch',
					en: 'Englisch',
				},
			} );
		} );
	}

}
