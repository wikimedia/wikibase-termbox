import request from 'supertest';
import mockQ64 from '@/mock-data/data/Q64_data.json';
import app from '@/server/app';
import nock from 'nock';
import { config } from '@/server/TermboxConfig';
import 'jest-dom/extend-expect';

const wikibaseRepoApi = new URL( config.getWikibaseRepoApi() );

const WIKIBASE_TEST_API_HOST = wikibaseRepoApi.origin;
const WIKIBASE_TEST_API_PATH = wikibaseRepoApi.pathname;

const germanInGerman = 'Deutsch';

function getDomFromMarkup( markup: string ): HTMLElement {
	const newNode = document.createElement( 'div' );
	newNode.innerHTML = markup;
	return newNode;
}

function nockSuccessfulLanguageTranslationLoading( inLanguage: string ) {
	nock( WIKIBASE_TEST_API_HOST )
		.post( WIKIBASE_TEST_API_PATH + '?format=json', {
			action: 'query',
			meta: 'wbcontentlanguages',
			wbclcontext: 'term',
			wbclprop: 'code|name',
			uselang: inLanguage,
		} )
		.reply( 200, {
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
		.reply( 200, {
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

		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', {
				ids: entityId,
				action: 'wbgetentities',
			} )
			.reply( 200, {
				malformed: 'yes',
			} );

		request( app ).get( '/termbox' ).query( { entity: entityId, language } ).then( ( response ) => {
			expect( response.status ).toBe( 500 );
			expect( response.text ).toContain( 'Technical problem' );
			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and entity backend request fails', ( done ) => {
		const entityId = 'Q64';
		const language = 'de';

		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', {
				ids: entityId,
				action: 'wbgetentities',
			} )
			.reply( 500, 'upstream system error' );

		request( app ).get( '/termbox' ).query( { entity: entityId, language } ).then( ( response ) => {
			expect( response.status ).toBe( 500 );
			expect( response.text ).toContain( 'Technical problem' );
			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and language translation backend request fails', ( done ) => {
		const entityId = 'Q64';
		const language = 'de';

		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				uselang: language,
			} )
			.reply( 500, 'upstream system error' );
		nockSuccessfulEntityLoading( entityId );

		request( app ).get( '/termbox' ).query( { entity: entityId, language } ).then( ( response ) => {
			expect( response.status ).toBe( 500 );
			expect( response.text ).toContain( 'Technical problem' );
			done();
		} );
	} );

	it( 'renders Bad Request when requesting /termbox without well-formed query', ( done ) => {
		request( app ).get( '/termbox' ).then( ( response ) => {
			expect( response.status ).toBe( 400 );
			expect( response.text ).toContain( 'Bad request' );
			done();
		} );
	} );

	it( 'renders Not found when requesting /termbox with well-formed query for unknown entity', ( done ) => {
		const entityId = 'Q63';
		const language = 'de';

		nockSuccessfulLanguageTranslationLoading( 'de' );
		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', 'ids=Q63&action=wbgetentities' )
			.reply( 200, {
				entities: {
					[ entityId ]: {
						missing: '',
					},
				},
			} );

		request( app ).get( '/termbox' ).query( { entity: entityId, language } ).then( ( response ) => {
			expect( response.status ).toBe( 404 );
			expect( response.text ).toContain( 'Entity not found' );
			done();
		} );
	} );

	it( 'renders the termbox when requesting /termbox with well-formed query for known entity', ( done ) => {
		const entityId = 'Q64';
		const language = 'de';

		nockSuccessfulLanguageTranslationLoading( language );
		nockSuccessfulEntityLoading( entityId );

		request( app ).get( '/termbox' ).query( { entity: entityId, language } ).then( ( response ) => {
			expect( response.status ).toBe( 200 );

			const $dom = getDomFromMarkup( response.text );

			expect( $dom.querySelector( '.wikibase-termbox__primaryLanguage' ) )
				.toBeVisible();

			expect( $dom.querySelector( '.wikibase-termbox__language' ) )
				.toHaveTextContent( germanInGerman );

			expect( $dom.querySelector( '.wikibase-termbox__label' ) )
				.toHaveTextContent( mockQ64.labels.de.value );
			expect( $dom.querySelector( '.wikibase-termbox__description' ) )
				.toHaveTextContent( mockQ64.descriptions.de.value );
			expect( $dom.querySelectorAll( '.wikibase-termbox__aliases li' ).length )
				.toBe( mockQ64.aliases.de.length );

			done();
		} );
	} );
} );
