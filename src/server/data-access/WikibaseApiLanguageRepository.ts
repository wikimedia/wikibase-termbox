import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import LanguageTranslations from '../../datamodel/LanguageTranslations';
import TechnicalProblem from '../../common/data-access/error/TechnicalProblem';
import TranslationLanguageNotFound from '@/common/data-access/error/TranslationLanguageNotFound';
import mwbot from 'mwbot';

export default class WikibaseApiLanguageRepository implements LanguageTranslationRepository {
	private bot: mwbot;

	public constructor( bot: mwbot ) {
		this.bot = bot;
	}

	public getLanguagesInLanguage( inLanguage: string ): Promise<LanguageTranslations> {
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

					if ( !( inLanguage in response.query.wbcontentlanguages ) ) {
						reject( new TranslationLanguageNotFound( 'Asked for data in a language that itself is not existing.' ) );
						return;
					}

					const translations = {} as any; // TODO why is multi [inLanguage][languageCode] not valid? not ltr?
					Object.entries( response.query.wbcontentlanguages ).forEach( ( [ languageCode, language ] ) => {
						if ( !( 'name' in language ) ) {
							throw new TechnicalProblem( 'Name for a language not given.' );
						}

						translations[ languageCode ] = ( language as any ).name as string;
					} );

					resolve( {
						[ inLanguage ]: translations,
					} as LanguageTranslations );
				} )
				.catch( ( reason: string ) => {
					reject( new TechnicalProblem( reason ) );
				} );
		} );
	}

}
