import TermboxHandler from '@/server/route-handler/termbox/TermboxHandler';
import mockQ64 from '@/mock-data/data/Q64_data.json';
import TermboxRequest from '@/common/TermboxRequest';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import InvalidRequest from '@/server/route-handler/termbox/error/InvalidRequest';
import RepoTechnicalProblem from '@/server/data-access/error/TechnicalProblem';
import RepoEntityNotFound from '@/server/data-access/error/EntityNotFound';
import EntityNotFound from '@/server/route-handler/termbox/error/EntityNotFound';
import TechnicalProblem from '@/server/route-handler/termbox/error/TechnicalProblem';
import EntityInitializer from '@/common/EntityInitializer';

function newTermboxHandler( queryValidator: any, repo: any ) {
	return new TermboxHandler( queryValidator, repo );
}

describe( 'TermboxHandler', () => {
	describe( 'createTermboxRequest', () => {
		it( 'resolves to TermboxRequest on valid request', ( done ) => {
			const entity = 'Q64';
			const language = 'de';
			const queryValidator = {
				validate: () => true,
			};
			const repo = {
				getFingerprintableEntity: ( id: string ) => {
					return Promise.resolve(
						( new EntityInitializer() ).newFromSerialization( mockQ64 ),
					);
				},
			};

			const routeHandler = newTermboxHandler( queryValidator, repo );
			routeHandler.createTermboxRequest( { entity, language } )
				.then( ( termboxRequest: TermboxRequest ) => {
					expect( termboxRequest ).toBeInstanceOf( TermboxRequest );
					expect( termboxRequest.language ).toEqual( language );
					expect( termboxRequest.entity ).toBeInstanceOf( FingerprintableEntity );
					expect( termboxRequest.entity.id ).toEqual( entity );
					done();
				} );
		} );

		it( 'rejects when failing to validate request', ( done ) => {
			const request = { entity: '', language: '' };
			const queryValidator = {
				validate: () => false,
				getErrors: () => [ { entity: 'bad' }, { language: 'worse' } ],
			};
			const routeHandler = newTermboxHandler( queryValidator, {} );

			routeHandler.createTermboxRequest( request )
				.catch( ( reason: Error ) => {
					expect( reason ).toBeInstanceOf( InvalidRequest );
					done();
				} );
		} );

		it( 'rejects when failing to complete repo request', ( done ) => {
			const entity = 'Q3';
			const language = 'de';
			const queryValidator = {
				validate: () => true,
			};
			const repo = {
				getFingerprintableEntity: ( entityId: string ) => {
					return Promise.reject( new RepoTechnicalProblem( 'some technical repo problem' ) );
				},
			};

			const routeHandler = newTermboxHandler( queryValidator, repo );
			routeHandler.createTermboxRequest( { entity, language } )
				.catch( ( reason: Error ) => {
					expect( reason ).toBeInstanceOf( TechnicalProblem );
					expect( reason.message ).toEqual( 'some technical repo problem' );
					done();
				} );
		} );

		it( 'rejects when failing to find entity in repo', ( done ) => {
			const entity = 'Q3';
			const language = 'de';
			const queryValidator = {
				validate: () => true,
			};
			const repo = {
				getFingerprintableEntity: ( entityId: string ) => {
					return Promise.reject( new RepoEntityNotFound( 'Entity flagged missing in response.' ) );
				},
			};

			const routeHandler = newTermboxHandler( queryValidator, repo );
			routeHandler.createTermboxRequest( { entity, language } )
				.catch( ( reason: Error ) => {
					expect( reason ).toBeInstanceOf( EntityNotFound );
					expect( reason.message ).toEqual( 'Entity flagged missing in response.' );
					done();
				} );
		} );

	} );
} );
