import LanguageRepository from '@/common/data-access/LanguageRepository';
import LanguageCollection from '@/datamodel/LanguageCollection';
import WikibaseContentLanguagesRepo from './WikibaseContentLanguagesRepo';
import RtlDetectLib from 'rtl-detect';

export default class ContentLanguagesLanguageRepo implements LanguageRepository {
	private languagesRepo: WikibaseContentLanguagesRepo;

	public constructor( languageRepo: WikibaseContentLanguagesRepo ) {
		this.languagesRepo = languageRepo;
	}

	public getLanguages(): Promise<LanguageCollection> {
		return this.languagesRepo.getContentLanguages( null )
			.then( ( contentLanguages ) => {
				const languages: LanguageCollection = {};
				Object.entries( contentLanguages ).forEach( ( [ languageCode, _language ] ) => {
					languages[ languageCode ] = {
						code: languageCode,
						// this does not do full justice to the directionality question
						// * languages do not have directionality - scripts do
						// * the configured wikibase instance may have more/different languages
						directionality: RtlDetectLib.getLangDir( languageCode ),
					};
				} );

				return languages;
			} );
	}

}
