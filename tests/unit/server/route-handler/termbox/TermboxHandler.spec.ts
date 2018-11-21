import TermboxHandler from '@/server/route-handler/termbox/TermboxHandler';
import TermboxRequest from '@/common/TermboxRequest';
import InvalidRequest from '@/server/route-handler/termbox/error/InvalidRequest';

function newTermboxHandler( queryValidator: any ) {
	return new TermboxHandler( queryValidator );
}

describe( 'TermboxHandler', () => {
	describe( 'createTermboxRequest', () => {
		it( 'resolves to TermboxRequest on valid request', ( done ) => {
			const entity = 'Q64';
			const language = 'de';
			const queryValidator = {
				validate: () => true,
			};

			const routeHandler = newTermboxHandler( queryValidator );
			routeHandler.createTermboxRequest( { entity, language } )
				.then( ( termboxRequest: TermboxRequest ) => {
					expect( termboxRequest ).toBeInstanceOf( TermboxRequest );
					expect( termboxRequest.language ).toEqual( language );
					expect( termboxRequest.entityId ).toEqual( entity );
					done();
				} );
		} );

		it( 'rejects when failing to validate request', ( done ) => {
			const request = { entity: '', language: '' };
			const queryValidator = {
				validate: () => false,
				getErrors: () => [ { entity: 'bad' }, { language: 'worse' } ],
			};
			const routeHandler = newTermboxHandler( queryValidator );

			routeHandler.createTermboxRequest( request )
				.catch( ( reason: Error ) => {
					expect( reason ).toBeInstanceOf( InvalidRequest );
					done();
				} );
		} );

	} );
} );
