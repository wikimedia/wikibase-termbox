import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import TranslationLanguageNotFound from '@/common/data-access/error/TranslationLanguageNotFound';
import AxiosWikibaseContentLanguagesRepo from '@/server/data-access/AxiosWikibaseContentLanguagesRepo';
import { WikibaseApiContentLanguages } from '@/server/data-access/WikibaseContentLanguagesRepo';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import { StatusCodes } from 'http-status-codes';
import AxiosTechnicalProblem from '@/common/data-access/error/AxiosTechnicalProblem';

const axiosMock = new MockAdapter( axios );

function newAxiosWikibaseContentLanguagesRepo() {
	return new AxiosWikibaseContentLanguagesRepo(
		axios,
	);
}

describe( 'AxiosWikibaseContentLanguagesRepo', () => {

	beforeEach( () => {
		axiosMock.reset();
	} );

	it( 'can be constructed with axios', () => {
		expect( newAxiosWikibaseContentLanguagesRepo() )
			.toBeInstanceOf( AxiosWikibaseContentLanguagesRepo );
	} );

	describe( 'getContentLanguages', () => {
		it( 'with well-formed wbcontentlanguages query with uselang resolves to languages on success', ( done ) => {
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

			axiosMock.onGet( MEDIAWIKI_API_SCRIPT, { params: {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				uselang: inLanguage,
			} } ).reply( StatusCodes.OK, results );

			const repo = newAxiosWikibaseContentLanguagesRepo();
			repo.getContentLanguages( inLanguage ).then( ( resultLanguages: WikibaseApiContentLanguages ) => {
				expect( resultLanguages ).toEqual( languages );
				done();
			} );
		} );

		it( 'with well-formed wbcontentlanguages query without uselang resolves to en languages', ( done ) => {
			const languages: WikibaseApiContentLanguages = {
				en: {
					code: 'en',
					name: 'English',
				},
				de: {
					code: 'de',
					name: 'German',
				},
			};
			const results = {
				batchcomplete: '',
				query: {
					wbcontentlanguages: languages,
				},
			};

			axiosMock.onGet( MEDIAWIKI_API_SCRIPT, { params: {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
			} } ).reply( StatusCodes.OK, results );

			const repo = newAxiosWikibaseContentLanguagesRepo();
			repo.getContentLanguages( null ).then( ( resultLanguages: WikibaseApiContentLanguages ) => {
				expect( resultLanguages ).toEqual( languages );
				done();
			} );
		} );

		it( 'rejects on result that does not contain an object', ( done ) => {
			const inLanguage = 'de';
			axiosMock.onGet().reply( StatusCodes.OK, '<some><random><html>' );

			const repo = newAxiosWikibaseContentLanguagesRepo();
			repo.getContentLanguages( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'wbcontentlanguages result not well formed.' );
				done();
			} );
		} );

		it( 'rejects in case of a malformed API response (missing query)', ( done ) => {
			const inLanguage = 'de';
			const results = {
				strangebody: 'yes',
			};

			axiosMock.onGet().reply( StatusCodes.OK, results );

			const repo = newAxiosWikibaseContentLanguagesRepo();
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

			axiosMock.onGet().reply( StatusCodes.OK, results );

			const repo = newAxiosWikibaseContentLanguagesRepo();
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

			axiosMock.onGet().reply( StatusCodes.OK, results );

			const repo = newAxiosWikibaseContentLanguagesRepo();
			repo.getContentLanguages( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TranslationLanguageNotFound );
				expect( reason.message ).toEqual( 'Asked for data in a language that itself is not existing.' );
				done();
			} );
		} );

		it( 'rejects stating the reason in case of API problems', ( done ) => {
			const inLanguage = 'de';

			axiosMock.onGet().reply( StatusCodes.INTERNAL_SERVER_ERROR, 'something went wrong in the API' );

			const repo = newAxiosWikibaseContentLanguagesRepo();
			repo.getContentLanguages( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( AxiosTechnicalProblem );
				expect( ( reason as AxiosTechnicalProblem ).getContext().message )
					.toEqual( 'Request failed with status code 500' );
				done();
			} );
		} );
	} );

} );
