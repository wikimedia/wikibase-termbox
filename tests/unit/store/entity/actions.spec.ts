import { actions } from '@/store/entity/actions';
import { ENTITY_INIT, SAVE } from '@/store/entity/actionTypes';
import { ENTITY_INIT as ENTITY_INIT_MUTATION } from '@/store/entity/mutationTypes';
import { factory } from '@/common/TermboxFactory';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import { EDITABILITY_UPDATE } from '@/store/entity/mutationTypes';
import newMockStore from '../newMockStore';
import newFingerprintable from '../../../newFingerprintable';

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
			const revision = 4711;

			const entity = new FingerprintableEntity( entityId, {}, {}, {} );
			factory.setEntityRepository( {
				getFingerprintableEntity: ( thisEntityId: string, thisRevision: number ) => {
					expect( thisEntityId ).toBe( entityId );
					expect( thisRevision ).toBe( revision );
					return Promise.resolve( entity );
				},
			} );
			const context = newMockStore( {
				commit: jest.fn(),
			} );

			actions[ ENTITY_INIT ]( context, { entity: entityId, revision } ).then( () => {
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

			const context = newMockStore( {
				commit: jest.fn(),
			} );

			return actions[ ENTITY_INIT ]( context, { entity: 'Q123', revision: 4711 } ).then( () => {
				expect( context.commit ).toHaveBeenCalledWith( EDITABILITY_UPDATE, isEditable );
			} );
		} );

		it( `propagates lookup rejection`, ( done ) => {
			const entityId = 'Q1';
			const revision = 4711;
			const error = new EntityNotFound( 'Entity not found' );
			factory.setEntityRepository( {
				getFingerprintableEntity: ( thisEntityId: string ) => {
					expect( thisEntityId ).toBe( entityId );
					return Promise.reject( error );
				},
			} );

			actions[ ENTITY_INIT ]( newMockStore( {} ), { entity: entityId, revision } ).catch( ( thisError: Error ) => {
				expect( thisError ).toBe( error );
				done();
			} );
		} );
	} );

	describe( SAVE, () => {
		it( 'saves the entity', () => {
			const entity = newFingerprintable( {
				id: 'Q16587531',
				labels: { en: 'potato', de: 'Kartoffel' },
				descriptions: { en: 'root vegetable' },
				aliases: { de: [ 'Erdapfel', 'Grundbirne' ] },
			} );
			const state = {
				id: entity.id,
				labels: entity.labels,
				descriptions: entity.descriptions,
				aliases: entity.aliases,
			};
			const writingRepository = {
				saveEntity: jest.fn(),
			};
			writingRepository.saveEntity.mockReturnValue( Promise.resolve() );
			factory.setWritingEntityRepository( writingRepository );

			return actions[ SAVE ]( newMockStore( { state } ) ).then( () => {
				expect( writingRepository.saveEntity ).toBeCalledWith( entity, /* TODO */ 0 );
			} );
		} );
	} );

} );
