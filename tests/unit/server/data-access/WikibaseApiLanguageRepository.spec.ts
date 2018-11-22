import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import TranslationLanguageNotFound from '@/common/data-access/error/TranslationLanguageNotFound';
import WikibaseApiLanguageRepository from '@/server/data-access/WikibaseApiLanguageRepository';
import mwbot from 'mwbot';
import LanguageTranslations from '@/datamodel/LanguageTranslations';

function newWikibaseApiLanguageRepository( bot: any ) {
	return new WikibaseApiLanguageRepository(
		bot,
	);
}

describe( 'WikibaseApiLanguageRepository', () => {

	it( 'can be constructed with mwbot', () => {
		expect( newWikibaseApiLanguageRepository( new mwbot( {} ) ) )
			.toBeInstanceOf( WikibaseApiLanguageRepository );
	} );

	describe( 'getLanguageName', () => {
		it( 'creates a well-formed wbcontentlanguages query', ( done ) => {
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

			const repo = newWikibaseApiLanguageRepository( bot );
			repo.getLanguagesInLanguage( inLanguage ).catch( () => {
				done();
			} );
		} );

		it( 'resolves to a language name on success', ( done ) => {
			const inLanguage = 'de';
			const results = {
				batchcomplete: '',
				query: {
					wbcontentlanguages: {
						en: {
							code: 'en',
							name: 'Englisch',
						},
						de: {
							code: 'de',
							name: 'Deutsch',
						},
					},
				},
			};
			const bot = {
				request: ( params: object ) => {
					return Promise.resolve( results );
				},
			};

			const repo = newWikibaseApiLanguageRepository( bot );
			repo.getLanguagesInLanguage( inLanguage ).then( ( languageTranslations: LanguageTranslations ) => {
				expect( languageTranslations ).toEqual( {
					[ inLanguage ]: {
						en: 'Englisch',
						de: 'Deutsch',
					},
				} as LanguageTranslations );
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

			const repo = newWikibaseApiLanguageRepository( bot );
			repo.getLanguagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
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

			const repo = newWikibaseApiLanguageRepository( bot );
			repo.getLanguagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
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

			const repo = newWikibaseApiLanguageRepository( bot );
			repo.getLanguagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TranslationLanguageNotFound );
				expect( reason.message ).toEqual( 'Asked for data in a language that itself is not existing.' );
				done();
			} );
		} );

		it( 'rejects in case a found language lacks the name property', ( done ) => {
			const inLanguage = 'de';
			const language = {
				code: 'en',
			};
			const results = {
				batchcomplete: '',
				query: {
					wbcontentlanguages: {
						en: language,
						de: {
							code: 'de',
							name: 'Deutsch',
						},
					},
				},
			};
			const bot = {
				request: ( params: object ) => {
					return Promise.resolve( results );
				},
			};

			const repo = newWikibaseApiLanguageRepository( bot );
			repo.getLanguagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'Error: Name for a language not given.' );
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
			const repo = newWikibaseApiLanguageRepository( bot );
			repo.getLanguagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'Error: invalidjson: No valid JSON response.' );
				done();
			} );
		} );
	} );
} );
