import request from 'supertest';
import mockQ64 from '@/mock-data/data/Q64_data.json';
import createApp from '@/server/app';
import nock from 'nock';
import 'jest-dom/extend-expect';
import HttpStatus from 'http-status-codes';
import Vue from 'vue';
import * as messages from '@/mock-data/data/de_messages_data.json';
import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import mwbot from 'mwbot';
import { MessageKeys } from '@/common/MessageKeys';

/**
 * edge-to-edge tests are simulating actual requests against the server
 * and are - by definition - run in a development context. While the
 * production tip is valuable for the server (should we bork config) it
 * makes no sense to show it during tests
 */
Vue.config.productionTip = false;

const WIKIBASE_TEST_API_HOST = 'http://mw.testonly.localhost';
const WIKIBASE_TEST_API_PATH = '/mediawiki/api.php';

const logger = {
	log: jest.fn(),
};

const services = new BundleRendererServices(
	new mwbot( {
		apiUrl: WIKIBASE_TEST_API_HOST + WIKIBASE_TEST_API_PATH,
	} ),
	logger,
);

const app = createApp( services );

const germanInGerman = 'Deutsch';

function getDomFromMarkup( markup: string ): HTMLElement {
	const newNode = document.createElement( 'div' );
	newNode.innerHTML = markup;
	return newNode;
}

function nockSuccessfulLanguageLoading( inLanguage: string ) {
	nock( WIKIBASE_TEST_API_HOST )
		.post( WIKIBASE_TEST_API_PATH + '?format=json', {
			action: 'query',
			meta: 'wbcontentlanguages',
			wbclcontext: 'term',
			wbclprop: 'code|name',
			uselang: inLanguage,
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
	nock( WIKIBASE_TEST_API_HOST )
		.post( WIKIBASE_TEST_API_PATH + '?format=json', {
			action: 'query',
			meta: 'allmessages',
			ammessages: messageKeys.join( '|' ),
			amlang: inLanguage,
		} )
		.reply( HttpStatus.OK, {
			batchcomplete: '',
			query: {
				allmessages: getApiResponseMessages( messageKeys ),
			},
		} );
}

function nockSuccessfulEntityLoading( entityId: string ) {
	nock( WIKIBASE_TEST_API_HOST )
		.post( WIKIBASE_TEST_API_PATH + '?format=json', {
			ids: entityId,
			action: 'wbgetentities',
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
		const language = 'de';
		const editLink = '/some/' + entityId;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', {
				ids: entityId,
				action: 'wbgetentities',
			} )
			.reply( HttpStatus.OK, {
				malformed: 'yes',
			} );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );

			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[0][0].toString() ).toEqual( 'Error: wbgetentities result not well formed.' );

			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and entity backend request fails', ( done ) => {
		const entityId = 'Q64';
		const language = 'de';
		const editLink = '/some';
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', {
				ids: entityId,
				action: 'wbgetentities',
			} )
			.reply( HttpStatus.INTERNAL_SERVER_ERROR, 'upstream system error' );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );

			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[0][0].toString() ).toEqual( 'Error: Error: invalidjson: No valid JSON response' );

			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and language translation backend request fails', ( done ) => {
		const entityId = 'Q64';
		const language = 'de';
		const editLink = '/some/' + entityId;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				uselang: language,
			} )
			.reply( HttpStatus.INTERNAL_SERVER_ERROR, 'upstream system error' );
		nockSuccessfulMessagesLoading( language );
		nockSuccessfulEntityLoading( entityId );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );

			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[0][0].toString() ).toEqual( 'Error: Error: invalidjson: No valid JSON response' );

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
		const entityId = 'Q63';
		const language = 'ylq';
		const editLink = '/some/' + entityId;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nockSuccessfulEntityLoading( entityId );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				uselang: language,
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
		const language = 'de';
		const editLink = '/some/' + entityId;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', 'ids=Q63&action=wbgetentities' )
			.reply( HttpStatus.OK, {
				entities: {
					[ entityId ]: {
						missing: '',
					},
				},
			} );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
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

	describe( 'successful /termbox request for a known entity', () => {

		it( 'renders the primary Fingerprint component in the requested language', () => {
			const entityId = 'Q64';
			const language = 'de';
			const editLink = '/some/' + entityId;

			nockSuccessfulLanguageLoading( language );
			nockSuccessfulMessagesLoading( language );
			nockSuccessfulEntityLoading( entityId );

			return request( app ).get( '/termbox' ).query( {
				entity: entityId,
				language,
				editLink,
				preferredLanguages: language,
			} ).then( ( response ) => {
				expectSuccessfulRequest( response );

				const $dom = getDomFromMarkup( response.text );

				expect( $dom.querySelectorAll( '.wb-ui-termbox' ).length ).toBe( 1 );

				const $primaryLanguageFingerprint = $dom
					.querySelector( '.wb-ui-fingerprint--primaryLanguage' );
				expect( $primaryLanguageFingerprint )
					.toBeVisible();

				const $language = $dom.querySelector( '.wb-ui-fingerprint__language' );
				expect( $language ).toHaveTextContent( germanInGerman );

				expectLabelInLanguage( $primaryLanguageFingerprint!, language );

				const $description = $dom.querySelector( '.wb-ui-description' );
				expect( $description ).toHaveTextContent( mockQ64.descriptions.de.value );
				expect( $description!.getAttribute( 'lang' ) ).toBe( language );
				expect( $description!.getAttribute( 'dir' ) ).toBe( 'ltr' );

				const $aliases = $dom.querySelector( '.wb-ui-aliases' );
				expect( $aliases!.getAttribute( 'lang' ) ).toBe( language );
				expect( $aliases!.getAttribute( 'dir' ) ).toBe( 'ltr' );
				expect( $aliases!.querySelectorAll( 'li' ) ).toHaveLength( mockQ64.aliases.de.length );

				expect( $dom.querySelector( '.wb-ui-edit-pen a' ) )
					.toHaveAttribute( 'href', editLink );
			} );
		} );

		it( 'renders the "in more languages" section for other preferred languages', () => {
			const entityId = 'Q64';
			const language = 'de';
			const preferredLanguages = 'de|en|fr';
			const secondaryLanguages = [ 'en', 'fr' ];

			nockSuccessfulLanguageLoading( language );
			nockSuccessfulMessagesLoading( language );
			nockSuccessfulEntityLoading( entityId );

			return request( app ).get( '/termbox' ).query( {
				entity: entityId,
				language,
				editLink: '/some/' + entityId,
				preferredLanguages,
			} ).then( ( response ) => {
				expectSuccessfulRequest( response );

				const $dom = getDomFromMarkup( response.text );
				const $moreLanguagesFingerprints = $dom.querySelectorAll(
					'.wb-ui-in-more-languages .wb-ui-fingerprint',
				);
				expect( $moreLanguagesFingerprints ).toHaveLength( secondaryLanguages.length );

				expectLabelInLanguage( $moreLanguagesFingerprints[ 0 ], secondaryLanguages[ 0 ] );
				expectLabelInLanguage( $moreLanguagesFingerprints[ 1 ], secondaryLanguages[ 1 ] );
			} );
		} );

		it( 'does not render the "all entered languages" button or section', () => {
			const entity = 'Q64';
			const language = 'de';

			nockSuccessfulLanguageLoading( language );
			nockSuccessfulMessagesLoading( language );
			nockSuccessfulEntityLoading( entity );

			return request( app ).get( '/termbox' ).query( {
				entity,
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
