import WikibaseContentLanguagesRepo, { WikibaseApiContentLanguages } from './WikibaseContentLanguagesRepo';
import { Deferred } from 'ts-deferred';

/**
 * This currently does answer all getContentLanguages() calls with the same promise, i.e.
 * only the first non-null inLanguage parameter will cause the content to be in requested language.
 * Implement mapping by language code should it ever be needed.
 * By definition this also means that calls with inLanguage null may never resolve if you are unsure
 * if a call with a non-null inLanguage will be performed. Use AxiosWikibaseContentLanguagesRepo directly in
 * these cases.
 */
export default class WaitingForLanguageWikibaseContentLanguagesRepo implements WikibaseContentLanguagesRepo {
	private loadingRepo: WikibaseContentLanguagesRepo;
	private deferred: Deferred<WikibaseApiContentLanguages>;

	public constructor( loadingRepo: WikibaseContentLanguagesRepo ) {
		this.loadingRepo = loadingRepo;
		this.deferred = new Deferred<WikibaseApiContentLanguages>();
	}

	public getContentLanguages( inLanguage: string|null ): Promise<WikibaseApiContentLanguages> {
		if ( inLanguage !== null ) {
			this.loadingRepo.getContentLanguages( inLanguage )
				.then( this.deferred.resolve )
				.catch( this.deferred.reject );
		}

		return this.deferred.promise;
	}
}
