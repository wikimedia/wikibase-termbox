import request from 'supertest';

import app from '@/server/app';

describe( 'Termbox SSR', () => {
	it( 'renders the termbox when requesting /termbox', ( done ) => {
		request( app ).get( '/termbox' ).then( ( response ) => {
			expect( response.status ).toBe( 200 );
			expect( response.text ).toContain( 'Hello from server' );
			done();
		} );
	} );
} );
