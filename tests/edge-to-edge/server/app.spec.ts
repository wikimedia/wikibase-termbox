import request from 'supertest';
import mockQ64 from '@/mock-data/data/Q64_data.json';
import app from '@/server/app';
import nock from 'nock';

const WIKIBASE_TEST_API_HOST = 'http://wikibase-repo-api.testonly.localhost';
const WIKIBASE_TEST_API_PATH = '/api.php';

describe( 'Termbox SSR', () => {
	app.set( 'WIKIBASE_REPO_API', WIKIBASE_TEST_API_HOST + WIKIBASE_TEST_API_PATH );

	afterEach( () => {
		nock.cleanAll();
		nock.enableNetConnect();
	} );

	it( 'renders Server Error when requesting /termbox and backend request encounters malformed response', ( done ) => {
		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', 'ids=Q64&action=wbgetentities' )
			.reply( 200, {
				malformed: 'yes',
			} );

		request( app ).get( '/termbox' ).query( { entity: 'Q64', language: 'de' } ).then( ( response ) => {
			expect( response.status ).toBe( 500 );
			expect( response.text ).toContain( 'Technical problem' );
			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and backend request fails', ( done ) => {
		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', 'ids=Q64&action=wbgetentities' )
			.reply( 500, 'upstream system error' );

		request( app ).get( '/termbox' ).query( { entity: 'Q64', language: 'de' } ).then( ( response ) => {
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
		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', 'ids=Q63&action=wbgetentities' )
			.reply( 200, {
				entities: {
					Q63: {
						missing: '',
					},
				},
			} );

		request( app ).get( '/termbox' ).query( { entity: 'Q63', language: 'de' } ).then( ( response ) => {
			expect( response.status ).toBe( 404 );
			expect( response.text ).toContain( 'Entity not found' );
			done();
		} );
	} );

	it( 'renders the termbox when requesting /termbox with well-formed query for known entity', ( done ) => {
		nock( WIKIBASE_TEST_API_HOST )
			.post( WIKIBASE_TEST_API_PATH + '?format=json', 'ids=Q64&action=wbgetentities' )
			.reply( 200, {
				entities: {
					Q64: mockQ64,
				},
			} );

		request( app ).get( '/termbox' ).query( { entity: 'Q64', language: 'de' } ).then( ( response ) => {
			expect( response.status ).toBe( 200 );
			expect( response.text ).toContain( '(Q64)' );
			done();
		} );
	} );
} );
