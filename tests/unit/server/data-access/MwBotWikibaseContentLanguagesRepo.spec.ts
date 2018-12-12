import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import TranslationLanguageNotFound from '@/common/data-access/error/TranslationLanguageNotFound';
import MwBotWikibaseContentLanguagesRepo from '@/server/data-access/MwBotWikibaseContentLanguagesRepo';
import mwbot from 'mwbot';
import { WikibaseApiContentLanguages } from '@/server/data-access/WikibaseContentLanguagesRepo';

function newMwBotWikibaseContentLanguagesRepo( bot: any ) {
	return new MwBotWikibaseContentLanguagesRepo(
		bot,
	);
}

describe( 'MwBotWikibaseContentLanguagesRepo', () => {

	it( 'can be constructed with mwbot', () => {
		expect( newMwBotWikibaseContentLanguagesRepo( new mwbot( {} ) ) )
			.toBeInstanceOf( MwBotWikibaseContentLanguagesRepo );
	} );

	describe( 'getContentLanguages', () => {
		it( 'creates a well-formed wbcontentlanguages query with uselang', ( done ) => {
			const inLanguage = 'de';
			const bot = {
				request: ( params: object ) => {
					expect( params ).toEqual( {
						action: 'query',
						meta: 'wbcontentlanguages',
						wbclcontext: 'term',
						wbclprop: 'code|name',
						uselang: inLanguage,
					} );

					return Promise.reject( 'This test focuses on the request.' );
				},
			};

			const repo = newMwBotWikibaseContentLanguagesRepo( bot );
			repo.getContentLanguages( inLanguage ).catch( () => {
				done();
			} );
		} );

		it( 'creates a well-formed wbcontentlanguages query without uselang', ( done ) => {
			const bot = {
				request: ( params: object ) => {
					expect( params ).toEqual( {
						action: 'query',
						meta: 'wbcontentlanguages',
						wbclcontext: 'term',
						wbclprop: 'code|name',
					} );

					return Promise.reject( 'This test focuses on the request.' );
				},
			};

			const repo = newMwBotWikibaseContentLanguagesRepo( bot );
			repo.getContentLanguages( null ).catch( () => {
				done();
			} );
		} );

		it( 'resolves to languages on success', ( done ) => {
			const inLanguage = 'de';
			const languages: WikibaseApiContentLanguages = {
				en: {
					code: 'en',
					name: 'Englisch',
				},
				de: {
					code: 'de',
					name: 'Deutsch',
				},
			};
			const results = {
				batchcomplete: '',
				query: {
					wbcontentlanguages: languages,
				},
			};
			const bot = {
				request: ( params: object ) => {
					return Promise.resolve( results );
				},
			};

			const repo = newMwBotWikibaseContentLanguagesRepo( bot );
			repo.getContentLanguages( inLanguage ).then( ( resultLanguages: WikibaseApiContentLanguages ) => {
				expect( resultLanguages ).toBe( languages );
				done();
			} );
		} );

		it( 'rejects in case of a malformed API response (missing query)', ( done ) => {
			const inLanguage = 'de';
			const results = {
				strangebody: 'yes',
			};
			const bot = {
				request: ( params: object ) => {
					return Promise.resolve( results );
				},
			};

			const repo = newMwBotWikibaseContentLanguagesRepo( bot );
			repo.getContentLanguages( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'wbcontentlanguages result not well formed.' );
				done();
			} );
		} );

		it( 'rejects in case of a malformed API response (missing query.wbcontentlanguages)', ( done ) => {
			const inLanguage = 'de';
			const results = {
				batchcomplete: '',
				query: {
					strangeprop: 'yes',
				},
			};
			const bot = {
				request: ( params: object ) => {
					return Promise.resolve( results );
				},
			};

			const repo = newMwBotWikibaseContentLanguagesRepo( bot );
			repo.getContentLanguages( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'wbcontentlanguages result not well formed.' );
				done();
			} );
		} );

		it( 'rejects in case of a missing translation language', ( done ) => {
			const inLanguage = 'foo';
			const results = {
				batchcomplete: '',
				query: {
					wbcontentlanguages: {
						en: {
							code: 'en',
							name: 'English',
						},
					},
				},
			};
			const bot = {
				request: ( params: object ) => {
					return Promise.resolve( results );
				},
			};

			const repo = newMwBotWikibaseContentLanguagesRepo( bot );
			repo.getContentLanguages( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TranslationLanguageNotFound );
				expect( reason.message ).toEqual( 'Asked for data in a language that itself is not existing.' );
				done();
			} );
		} );

		it( 'rejects stating the reason in case of API problems', ( done ) => {
			const inLanguage = 'de';
			const bot = {
				request: ( params: object ) => {
					return Promise.reject( new Error( 'invalidjson: No valid JSON response.' ) );
				},
			};
			const repo = newMwBotWikibaseContentLanguagesRepo( bot );
			repo.getContentLanguages( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'Error: invalidjson: No valid JSON response.' );
				done();
			} );
		} );
	} );

} );
