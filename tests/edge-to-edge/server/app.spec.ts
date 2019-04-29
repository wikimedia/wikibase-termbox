import request from 'supertest';
import mockQ64 from '@/mock-data/data/Q64_data.json';
import createApp from '@/server/app';
import nock from 'nock';
import 'jest-dom/extend-expect';
import HttpStatus from 'http-status-codes';
import Vue from 'vue';
import * as messages from '@/mock-data/data/de_messages_data.json';
import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { MessageKeys } from '@/common/MessageKeys';
/**
 * arguably we could not add GLOBAL_REQUEST_PARAMS to neither axios (building the request)
 * nor nock (mocking the response) but this way it is closer to reality (cf. server.ts)
 */
import { MEDIAWIKI_API_SCRIPT, MEDIAWIKI_INDEX_SCRIPT, GLOBAL_REQUEST_PARAMS } from '@/common/constants';
import AxiosSpecialPageEntityRepo from '@/server/data-access/AxiosSpecialPageEntityRepo';

/**
 * edge-to-edge tests are simulating actual requests against the server
 * and are - by definition - run in a development context. While the
 * production tip is valuable for the server (should we bork config) it
 * makes no sense to show it during tests
 */
Vue.config.productionTip = false;
Vue.config.devtools = false;

const WIKIBASE_TEST_HOST = 'http://mw.testonly.localhost';
const WIKIBASE_TEST_API_PATH = '/' + MEDIAWIKI_API_SCRIPT;
const WIKIBASE_TEST_INDEX_PATH = '/' + MEDIAWIKI_INDEX_SCRIPT;

const logger = {
	log: jest.fn(),
};

const services = new BundleRendererServices(
	axios.create( {
		baseURL: WIKIBASE_TEST_HOST,
		adapter: httpAdapter, // https://github.com/axios/axios/issues/305#issuecomment-272162405
		params: {
			...GLOBAL_REQUEST_PARAMS,
		},
	} ),
	logger,
);

const app = createApp( services );

const germanInGerman = 'Deutsch';

// there is no magic behind these (request and response mocked); tries to reduce magic numbers, improve readability
const REVISION_MATCHING_ENTITY = 4711;
const REVISION_NOT_MATCHING_ENTITY = 815;

function getDomFromMarkup( markup: string ): HTMLElement {
	const newNode = document.createElement( 'div' );
	newNode.innerHTML = markup;
	return newNode;
}

function nockSuccessfulLanguageLoading( inLanguage: string ) {
	nock( WIKIBASE_TEST_HOST )
		.get( WIKIBASE_TEST_API_PATH )
		.query( {
			action: 'query',
			meta: 'wbcontentlanguages',
			wbclcontext: 'term',
			wbclprop: 'code|name',
			uselang: inLanguage,
			...GLOBAL_REQUEST_PARAMS,
		} )
		.reply( HttpStatus.OK, {
			batchcomplete: '',
			query: {
				wbcontentlanguages: {
					en: {
						code: 'en',
						name: 'Englisch',
					},
					de: {
						code: 'de',
						name: germanInGerman,
					},
					fr: {
						code: 'fr',
						name: 'Français',
					},
				},
			},
		} );
}

function getApiResponseMessages( keys: string[] ) {
	return keys.map( ( key ) => ( {
		'name': key,
		'normalizedname': key,
		'*': messages.default[ key ],
	} ) );
}

function nockSuccessfulMessagesLoading( inLanguage: string ) {
	const messageKeys = Object.values( MessageKeys );
	nock( WIKIBASE_TEST_HOST )
		.get( WIKIBASE_TEST_API_PATH )
		.query( {
			action: 'query',
			meta: 'allmessages',
			ammessages: messageKeys.join( '|' ),
			amlang: inLanguage,
			...GLOBAL_REQUEST_PARAMS,
		} )
		.reply( HttpStatus.OK, {
			batchcomplete: '',
			query: {
				allmessages: getApiResponseMessages( messageKeys ),
			},
		} );
}

function nockSuccessfulEntityLoading( entityId: string, revision: number ) {
	nock( WIKIBASE_TEST_HOST )
		.get( WIKIBASE_TEST_INDEX_PATH )
		.query( {
			id: entityId,
			revision,
			title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
			...GLOBAL_REQUEST_PARAMS,
		} )
		.reply( HttpStatus.OK, {
			entities: {
				[ entityId ]: mockQ64, // TODO build dynamic mock response if needed
			},
		} );
}

function expectLabelInLanguage( $fingerprint: Element, language: string, directionality = 'ltr' ) {
	const $label = $fingerprint.querySelector( '.wb-ui-label' );
	expect( $label ).toHaveTextContent( mockQ64.labels[ language ].value );
	expect( $label ).toBeInstanceOf( Element );
	expect( $label!.getAttribute( 'lang' ) ).toBe( language );
	expect( $label!.getAttribute( 'dir' ) ).toBe( directionality );
}

function expectSuccessfulRequest( response: request.Response ) {
	expect( response.status ).toBe( 200 );
	expect( logger.log ).not.toBeCalled();
}

describe( 'Termbox SSR', () => {
	afterEach( () => {
		nock.cleanAll();
		nock.enableNetConnect();

		logger.log.mockClear();
	} );

	it( 'renders Server Error when requesting /termbox and entity backend emits malformed response', ( done ) => {
		const entityId = 'Q64';
		const revision = REVISION_MATCHING_ENTITY;
		const language = 'de';
		const editLink = '/some/' + entityId;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_INDEX_PATH )
			.query( {
				id: entityId,
				revision,
				title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( HttpStatus.OK, {
				malformed: 'yes',
			} );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );

			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[ 0 ][ 0 ].toString() ).toEqual( 'Error: result not well formed.' );

			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and entity backend request fails', ( done ) => {
		const entityId = 'Q64';
		const revision = REVISION_MATCHING_ENTITY;
		const language = 'de';
		const editLink = '/some';
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_INDEX_PATH )
			.query( {
				id: entityId,
				revision,
				title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( HttpStatus.INTERNAL_SERVER_ERROR, 'upstream system error' );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );

			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[ 0 ][ 0 ].toString() )
				.toEqual( 'Error: Error: Request failed with status code 500' );

			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and language translation backend request fails', ( done ) => {
		const entityId = 'Q64';
		const revision = REVISION_MATCHING_ENTITY;
		const language = 'de';
		const editLink = '/some/' + entityId;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_API_PATH )
			.query( {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				uselang: language,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( HttpStatus.INTERNAL_SERVER_ERROR, 'upstream system error' );
		nockSuccessfulMessagesLoading( language );
		nockSuccessfulEntityLoading( entityId, revision );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );

			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[ 0 ][ 0 ].toString() )
				.toEqual( 'Error: Error: Request failed with status code 500' );

			done();
		} );
	} );

	it( 'renders Bad Request when requesting /termbox without well-formed query', ( done ) => {
		request( app ).get( '/termbox' ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.BAD_REQUEST );
			expect( response.text ).toContain( 'Bad request' );
			done();
		} );
	} );

	it( 'renders Bad request when requesting /termbox with well-formed query for unknown language', ( done ) => {
		const entityId = 'Q64';
		const revision = REVISION_MATCHING_ENTITY;
		const language = 'ylq';
		const editLink = '/some/' + entityId;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nockSuccessfulEntityLoading( entityId, revision );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_API_PATH )
			.query( {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				uselang: language,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( HttpStatus.OK, {
				batchcomplete: '',
				query: {
					wbcontentlanguages: {
						en: {
							code: 'en',
							name: 'English',
						},
						de: {
							code: 'de',
							name: 'German',
						},
					},
				},
			} );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.BAD_REQUEST );
			expect( response.text ).toContain( 'Bad request. Language not existing' );
			expect( logger.log ).not.toBeCalled();
			done();
		} );
	} );

	it( 'renders Not found when requesting /termbox with well-formed query for unknown entity', ( done ) => {
		const entityId = 'Q63';
		const revision = REVISION_NOT_MATCHING_ENTITY;
		const language = 'de';
		const editLink = '/some/' + entityId;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_INDEX_PATH )
			.query( {
				id: entityId,
				revision,
				title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( HttpStatus.NOT_FOUND, '<html><body><h1>Not Found</h1></body></html>' );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.NOT_FOUND );
			expect( response.text ).toContain( 'Entity not found' );
			expect( logger.log ).not.toBeCalled();
			done();
		} );
	} );

	it( 'renders Not found when requesting /termbox with well-formed query for revision not matching entity', () => {
		const entityId = 'Q64';
		const revision = REVISION_NOT_MATCHING_ENTITY;
		const language = 'de';
		const editLink = '/some/' + entityId;
		const preferredLanguages = 'de|en';

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_INDEX_PATH )
			.query( {
				id: entityId,
				revision,
				title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply(
				HttpStatus.NOT_FOUND,
				`<h1>Not Found</h1><p>Can't show revision ${revision} of entity ${entityId}.</p>`,
			);

		return request( app ).get( '/termbox' ).query( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.NOT_FOUND );
			expect( response.text ).toContain( 'Entity not found' );
			expect( logger.log ).not.toBeCalled();
		} );
	} );

	describe( 'successful /termbox request for a known entity', () => {

		it( 'renders the primary MonolingualFingerprintView component in the requested language', () => {
			const entityId = 'Q64';
			const revision = REVISION_MATCHING_ENTITY;
			const language = 'de';
			const editLink = '/some/' + entityId;

			nockSuccessfulLanguageLoading( language );
			nockSuccessfulMessagesLoading( language );
			nockSuccessfulEntityLoading( entityId, revision );

			return request( app ).get( '/termbox' ).query( {
				entity: entityId,
				revision,
				language,
				editLink,
				preferredLanguages: language,
			} ).then( ( response ) => {
				expectSuccessfulRequest( response );

				const $dom = getDomFromMarkup( response.text );

				expect( $dom.querySelectorAll( '.wb-ui-termbox' ).length ).toBe( 1 );

				const $primaryLanguageMonolingualFingerprintView = $dom
					.querySelector( '.wb-ui-monolingualfingerprintview--primaryLanguage' );
				expect( $primaryLanguageMonolingualFingerprintView )
					.toBeVisible();

				const $language = $dom.querySelector( '.wb-ui-monolingualfingerprintview__language' );
				expect( $language ).toHaveTextContent( germanInGerman );

				expectLabelInLanguage( $primaryLanguageMonolingualFingerprintView!, language );

				const $description = $dom.querySelector( '.wb-ui-description' );
				expect( $description ).toHaveTextContent( mockQ64.descriptions.de.value );
				expect( $description!.getAttribute( 'lang' ) ).toBe( language );
				expect( $description!.getAttribute( 'dir' ) ).toBe( 'ltr' );

				const $aliases = $dom.querySelector( '.wb-ui-aliases' );
				expect( $aliases!.getAttribute( 'lang' ) ).toBe( language );
				expect( $aliases!.getAttribute( 'dir' ) ).toBe( 'ltr' );
				expect( $aliases!.querySelectorAll( 'li' ) ).toHaveLength( mockQ64.aliases.de.length );

				expect( $dom.querySelector( '.wb-ui-event-emitting-button--edit' ) )
					.toHaveAttribute( 'href', editLink );
			} );
		} );

		it( 'renders the "in more languages" section for other preferred languages', () => {
			const entityId = 'Q64';
			const revision = REVISION_MATCHING_ENTITY;
			const language = 'de';
			const preferredLanguages = 'de|en|fr';
			const secondaryLanguages = [ 'en', 'fr' ];

			nockSuccessfulLanguageLoading( language );
			nockSuccessfulMessagesLoading( language );
			nockSuccessfulEntityLoading( entityId, revision );

			return request( app ).get( '/termbox' ).query( {
				entity: entityId,
				revision,
				language,
				editLink: '/some/' + entityId,
				preferredLanguages,
			} ).then( ( response ) => {
				expectSuccessfulRequest( response );

				const $dom = getDomFromMarkup( response.text );
				const $moreLanguagesMonolingualFingerprintViews = $dom.querySelectorAll(
					'.wb-ui-in-more-languages .wb-ui-monolingualfingerprintview',
				);
				expect( $moreLanguagesMonolingualFingerprintViews ).toHaveLength( secondaryLanguages.length );

				expectLabelInLanguage( $moreLanguagesMonolingualFingerprintViews[ 0 ], secondaryLanguages[ 0 ] );
				expectLabelInLanguage( $moreLanguagesMonolingualFingerprintViews[ 1 ], secondaryLanguages[ 1 ] );
			} );
		} );

		it( 'does not render the "all entered languages" button or section', () => {
			const entity = 'Q64';
			const revision = REVISION_MATCHING_ENTITY;
			const language = 'de';

			nockSuccessfulLanguageLoading( language );
			nockSuccessfulMessagesLoading( language );
			nockSuccessfulEntityLoading( entity, revision );

			return request( app ).get( '/termbox' ).query( {
				entity,
				revision,
				language,
				editLink: '/some/' + entity,
				preferredLanguages: 'de|en|fr',
			} ).then( ( response: request.Response ) => {
				expectSuccessfulRequest( response );
				expect(
					getDomFromMarkup( response.text ).querySelector( '.wb-ui-all-entered-languages' ),
				).toBeNull();
			} );
		} );

	} );

} );

describe( 'Open API Spec', () => {
	it( 'returns a spec when passing spec query param to /', () => {
		return request( app ).get( '/' ).query( {
			spec: 'foo',
		} ).then( ( response ) => {
			expect( JSON.parse( response.text ).info.title ).toBe( 'wikibase-termbox' );
		} );
	} );
} );
