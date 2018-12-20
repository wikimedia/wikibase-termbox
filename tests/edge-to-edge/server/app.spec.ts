import request from 'supertest';
import mockQ64 from '@/mock-data/data/Q64_data.json';
import createApp from '@/server/app';
import nock from 'nock';
import 'jest-dom/extend-expect';
import HttpStatus from 'http-status-codes';
import Vue from 'vue';

/**
 * edge-to-edge tests are simulating actual requests against the server
 * and are - by definition - run in a development context. While the
 * production tip is valuable for the server (should we bork config) it
 * makes no sense to show it during tests
 */
Vue.config.productionTip = false;

const WIKIBASE_TEST_API_HOST = 'http://mw.testonly.localhost';
const WIKIBASE_TEST_API_PATH = '/mediawiki/api.php';

const app = createApp( WIKIBASE_TEST_API_HOST + WIKIBASE_TEST_API_PATH );

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
				},
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

describe( 'Termbox SSR', () => {
	afterEach( () => {
		nock.cleanAll();
		nock.enableNetConnect();
	} );

	it( 'renders Server Error when requesting /termbox and entity backend emits malformed response', ( done ) => {
		const entityId = 'Q64';
		const language = 'de';
		const editLink = '/some/' + entityId;

		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', {
				ids: entityId,
				action: 'wbgetentities',
			} )
			.reply( HttpStatus.OK, {
				malformed: 'yes',
			} );

		request( app ).get( '/termbox' ).query( { entity: entityId, language, editLink } ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );
			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and entity backend request fails', ( done ) => {
		const entityId = 'Q64';
		const language = 'de';
		const editLink = '/some';

		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', {
				ids: entityId,
				action: 'wbgetentities',
			} )
			.reply( HttpStatus.INTERNAL_SERVER_ERROR, 'upstream system error' );

		request( app ).get( '/termbox' ).query( { entity: entityId, language, editLink } ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );
			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and language translation backend request fails', ( done ) => {
		const entityId = 'Q64';
		const language = 'de';
		const editLink = '/some/' + entityId;

		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				uselang: language,
			} )
			.reply( HttpStatus.INTERNAL_SERVER_ERROR, 'upstream system error' );
		nockSuccessfulEntityLoading( entityId );

		request( app ).get( '/termbox' ).query( { entity: entityId, language, editLink } ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );
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

		nockSuccessfulEntityLoading( entityId );
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

		request( app ).get( '/termbox' ).query( { entity: entityId, language, editLink } ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.BAD_REQUEST );
			expect( response.text ).toContain( 'Bad request. Language not existing' );
			done();
		} );
	} );

	it( 'renders Not found when requesting /termbox with well-formed query for unknown entity', ( done ) => {
		const entityId = 'Q63';
		const language = 'de';
		const editLink = '/some/' + entityId;

		nockSuccessfulLanguageLoading( 'de' );
		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', 'ids=Q63&action=wbgetentities' )
			.reply( HttpStatus.OK, {
				entities: {
					[ entityId ]: {
						missing: '',
					},
				},
			} );

		request( app ).get( '/termbox' ).query( { entity: entityId, language, editLink } ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.NOT_FOUND );
			expect( response.text ).toContain( 'Entity not found' );
			done();
		} );
	} );

	it( 'renders the termbox when requesting /termbox with well-formed query for known entity', ( done ) => {
		const entityId = 'Q64';
		const language = 'de';
		const editLink = '/some/' + entityId;

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulEntityLoading( entityId );

		request( app ).get( '/termbox' ).query( { entity: entityId, language, editLink } ).then( ( response ) => {
			expect( response.status ).toBe( HttpStatus.OK );

			const $dom = getDomFromMarkup( response.text );

			expect( $dom.querySelectorAll( '.wikibase-termbox' ).length ).toBe( 1 );

			expect( $dom.querySelector( '.wikibase-termbox--primaryLanguage' ) )
				.toBeVisible();

			expect( $dom.querySelector( '.wikibase-termbox__language' ) )
				.toHaveTextContent( germanInGerman );

			expect( $dom.querySelector( '.wikibase-termbox__label' ) )
				.toHaveTextContent( mockQ64.labels.de.value );
			expect( $dom.querySelector( '.wikibase-termbox__description' ) )
				.toHaveTextContent( mockQ64.descriptions.de.value );
			expect( $dom.querySelectorAll( '.wikibase-termbox__aliases li' ).length )
				.toBe( mockQ64.aliases.de.length );

			expect( $dom.querySelector( '.wikibase-termbox__edit-action a' ) )
				.toHaveAttribute( 'href', editLink );

			done();
		} );
	} );
} );
