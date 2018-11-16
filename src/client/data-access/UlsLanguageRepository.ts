import LanguageRepository from '@/common/data-access/LanguageRepository';

export default class UlsLanguageRepository implements LanguageRepository {

	public getLanguageName( languageCode: string, inLanguage: string ): Promise<string> {
		return new Promise<string>( ( resolve ) => {
			resolve( 'English' );
		} );
	}

}
