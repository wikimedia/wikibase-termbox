import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import TranslationLanguageNotFound from '@/common/data-access/error/TranslationLanguageNotFound';
import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import WikibaseContentLanguagesRepo, { WikibaseApiContentLanguages } from './WikibaseContentLanguagesRepo';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import AxiosTechnicalProblem from '@/common/data-access/error/AxiosTechnicalProblem';

export default class AxiosWikibaseContentLanguagesRepo implements WikibaseContentLanguagesRepo {
	private axios: AxiosInstance;

	public constructor( axios: AxiosInstance ) {
		this.axios = axios;
	}

	public getContentLanguages( inLanguage: string|null ): Promise<WikibaseApiContentLanguages> {
		return new Promise( ( resolve, reject ) => {
			let inLanguageParam = {};
			if ( inLanguage !== null ) {
				inLanguageParam = {
					uselang: inLanguage,
				};
			}

			this.axios.get( MEDIAWIKI_API_SCRIPT, { params: {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				...inLanguageParam,
			} } )
				.then( ( response: AxiosResponse ) => {
					const data = response.data;

					if ( typeof data !== 'object' || !( 'query' in data ) ) {
						reject( new TechnicalProblem( 'wbcontentlanguages result not well formed.' ) );
						return;
					}

					if ( !( 'wbcontentlanguages' in data.query ) ) {
						reject( new TechnicalProblem( 'wbcontentlanguages result not well formed.' ) );
						return;
					}

					if ( inLanguage && !( inLanguage in data.query.wbcontentlanguages ) ) {
						reject( new TranslationLanguageNotFound(
							'Asked for data in a language that itself is not existing.',
							{ requestedLanguage: inLanguage },
						) );
						return;
					}

					resolve( data.query.wbcontentlanguages );
				} )
				.catch( ( error: AxiosError ) => {
					reject( new AxiosTechnicalProblem( error ) );
				} );
		} );

	}
}
