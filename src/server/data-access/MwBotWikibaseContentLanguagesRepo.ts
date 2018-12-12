import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import TranslationLanguageNotFound from '@/common/data-access/error/TranslationLanguageNotFound';
import mwbot from 'mwbot';
import WikibaseContentLanguagesRepo, { WikibaseApiContentLanguages } from './WikibaseContentLanguagesRepo';

export default class MwBotWikibaseContentLanguagesRepo implements WikibaseContentLanguagesRepo {
	private bot: mwbot;

	public constructor( bot: mwbot ) {
		this.bot = bot;
	}

	public getContentLanguages( inLanguage: string|null ): Promise<WikibaseApiContentLanguages> {
		return new Promise( ( resolve, reject ) => {
			this.bot.request( {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				uselang: inLanguage,
			} )
				.then( ( response: any ) => {
					if ( !( 'query' in response ) ) {
						reject( new TechnicalProblem( 'wbcontentlanguages result not well formed.' ) );
						return;
					}

					if ( !( 'wbcontentlanguages' in response.query ) ) {
						reject( new TechnicalProblem( 'wbcontentlanguages result not well formed.' ) );
						return;
					}

					if ( inLanguage && !( inLanguage in response.query.wbcontentlanguages ) ) {
						reject( new TranslationLanguageNotFound( 'Asked for data in a language that itself is not existing.' ) );
						return;
					}

					resolve( response.query.wbcontentlanguages );
				} )
				.catch( ( reason: string ) => {
					reject( new TechnicalProblem( reason ) );
				} );
		} );

	}
}
