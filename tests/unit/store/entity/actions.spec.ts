import { actions } from '@/store/entity/actions';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import { ENTITY_INIT as ENTITY_INIT_MUTATION } from '@/store/entity/mutationTypes';
import { factory } from '@/common/TermboxFactory';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import { EDITABILITY_UPDATE } from '@/store/entity/mutationTypes';

describe( 'entity/actions', () => {
	describe( ENTITY_INIT, () => {
		beforeEach( () => {
			factory.setEntityEditabilityResolver( {
				isEditable: () => Promise.resolve( true ),
			} );
			factory.setEntityRepository( {
				getFingerprintableEntity: () => Promise.resolve(
					new FingerprintableEntity( 'Q123', {}, {}, {} ),
				),
			} );
		} );

		it( `commits to ${ENTITY_INIT_MUTATION} on successful FingerprintableEntity lookup`, ( done ) => {
			const entityId = 'Q42';

			const entity = new FingerprintableEntity( entityId, {}, {}, {} );
			factory.setEntityRepository( {
				getFingerprintableEntity: ( thisEntityId: string ) => {
					expect( thisEntityId ).toBe( entityId );
					return Promise.resolve( entity );
				},
			} );
			const context = {
				commit: jest.fn(),
			};
			const action = actions[ ENTITY_INIT ] as any;

			action( context, entityId ).then( () => {
				expect( context.commit ).toBeCalledWith(
					ENTITY_INIT_MUTATION,
					entity,
				);
				done();
			} );
		} );

		it( `commits to ${EDITABILITY_UPDATE} on successful lookup and editability resolution`, () => {
			const isEditable = true;
			factory.setEntityEditabilityResolver( {
				isEditable: () => Promise.resolve( isEditable ),
			} );

			const context = {
				commit: jest.fn(),
			};

			return ( actions[ ENTITY_INIT ] as any )( context, 'Q1' ).then( () => {
				expect( context.commit ).toHaveBeenCalledWith( EDITABILITY_UPDATE, isEditable );
			} );
		} );

		it( `propagates lookup rejection`, ( done ) => {
			const entityId = 'Q1';
			const error = new EntityNotFound( 'Entity not found' );
			factory.setEntityRepository( {
				getFingerprintableEntity: ( thisEntityId: string ) => {
					expect( thisEntityId ).toBe( entityId );
					return Promise.reject( error );
				},
			} );
			const action = actions[ ENTITY_INIT ] as any; // TODO

			action( {}, entityId ).catch( ( thisError: Error ) => {
				expect( thisError ).toBe( error );
				done();
			} );
		} );
	} );

} );
