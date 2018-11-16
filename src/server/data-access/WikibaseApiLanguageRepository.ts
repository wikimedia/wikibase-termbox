import LanguageRepository from '@/common/data-access/LanguageRepository';

export default class WikibaseApiLanguageRepository implements LanguageRepository {

	public getLanguageName( languageCode: string, inLanguage: string ): Promise<string> {
		return new Promise<string>( ( resolve ) => {
			resolve( '' );
		} );
	}

}
