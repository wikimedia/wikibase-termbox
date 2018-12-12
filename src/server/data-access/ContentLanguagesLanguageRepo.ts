import LanguageRepository from '@/common/data-access/LanguageRepository';
import LanguageCollection from '@/datamodel/LanguageCollection';
import Language from '@/datamodel/Language';
import WikibaseContentLanguagesRepo, { WikibaseApiContentLanguages } from './WikibaseContentLanguagesRepo';

export default class ContentLanguagesLanguageRepo implements LanguageRepository {
	private languagesRepo: WikibaseContentLanguagesRepo;

	public constructor( languageRepo: WikibaseContentLanguagesRepo ) {
		this.languagesRepo = languageRepo;
	}

	public getLanguages(): Promise<LanguageCollection> {
		return this.languagesRepo.getContentLanguages( null )
			.then( ( contentLanguages: WikibaseApiContentLanguages ) => {
				const languages: LanguageCollection = {};
				Object.entries( contentLanguages ).forEach( ( [ languageCode, language ] ) => {
					languages[ languageCode ] = {
						code: languageCode,
						directionality: 'ltr',
					} as Language;
				} );

				return languages;
			} );
	}

}
