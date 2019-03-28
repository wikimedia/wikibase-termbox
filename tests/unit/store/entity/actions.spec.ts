import { actions } from '@/store/entity/actions';
import {
	ENTITY_INIT,
	ENTITY_ALIASES_EDIT,
	ENTITY_DESCRIPTION_EDIT,
	ENTITY_LABEL_EDIT,
	ENTITY_SAVE,
} from '@/store/entity/actionTypes';
import {
	EDITABILITY_UPDATE,
	ENTITY_UPDATE,
	ENTITY_SET_LABEL as ENTITY_SET_LABEL_MUTATION,
	ENTITY_SET_ALIASES as ENTITY_ALIASES_EDIT_MUTATION,
	ENTITY_SET_DESCRIPTION as ENTITY_SET_DESCRIPTION_MUTATION,
	ENTITY_REVISION_UPDATE,
} from '@/store/entity/mutationTypes';
import { factory } from '@/common/TermboxFactory';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import newMockStore from '../newMockStore';
import newFingerprintable from '../../../newFingerprintable';
import EntityRevision from '@/datamodel/EntityRevision';

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

		it( `commits to ${ENTITY_UPDATE} on successful FingerprintableEntity lookup`, ( done ) => {
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
					ENTITY_UPDATE,
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

		it( `commits to ${ENTITY_REVISION_UPDATE} on successful entity lookup`, () => {
			const revision = 4711;
			const context = newMockStore( {
				commit: jest.fn(),
			} );

			return actions[ ENTITY_INIT ]( context, { entity: 'Q123', revision } ).then( () => {
				expect( context.commit ).toHaveBeenCalledWith( ENTITY_REVISION_UPDATE, revision );
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

	describe( ENTITY_SAVE, () => {
		it( 'saves the entity', () => {
			const entity = newFingerprintable( {
				id: 'Q16587531',
				labels: { en: 'potato', de: 'Kartoffel' },
				descriptions: { en: 'root vegetable' },
				aliases: { de: [ 'Erdapfel', 'Grundbirne' ] },
			} );
			const baseRevision = 4711;
			const state = {
				id: entity.id,
				baseRevision,
				labels: entity.labels,
				descriptions: entity.descriptions,
				aliases: entity.aliases,
			};
			const writingRepository = {
				saveEntity: jest.fn().mockResolvedValue( new ( jest.fn() )() ),
			};
			factory.setWritingEntityRepository( writingRepository );

			return actions[ ENTITY_SAVE ]( newMockStore( { state } ) ).then( () => {
				expect( writingRepository.saveEntity ).toBeCalledWith( entity, baseRevision );
			} );
		} );

		it( 'updates the entity with latest data and revision after saving', () => {
			const responseEntityRevision = new EntityRevision(
				newFingerprintable( { id: 'Q123', labels: { en: 'potato', de: 'Kartoffel' } } ),
				321,
			);
			const writingRepository = {
				saveEntity: jest.fn().mockResolvedValue( responseEntityRevision ),
			};
			factory.setWritingEntityRepository( writingRepository );
			const store = { commit: jest.fn() };

			return actions[ ENTITY_SAVE ]( newMockStore( store ) ).then( () => {
				expect( store.commit ).toHaveBeenCalledWith( ENTITY_REVISION_UPDATE, responseEntityRevision.revisionId );
				expect( store.commit ).toHaveBeenCalledWith( ENTITY_UPDATE, responseEntityRevision.entity );
			} );
		} );
	} );

	describe( ENTITY_LABEL_EDIT, () => {
		it( `commits to ${ENTITY_SET_LABEL_MUTATION} on label update action`, () => {
			const commitMock = jest.fn();
			const context = newMockStore( {
				commit: commitMock,
			} );

			const newTerm = { language: 'en', value: 'goat' };
			actions[ ENTITY_LABEL_EDIT ]( context, newTerm );
			expect( commitMock ).toHaveBeenLastCalledWith(
				ENTITY_SET_LABEL_MUTATION,
				newTerm,
			);
		} );
	} );

	describe( ENTITY_DESCRIPTION_EDIT, () => {
		it( `commits to ${ENTITY_SET_DESCRIPTION_MUTATION} on label update action`, () => {
			const commitMock = jest.fn();
			const context =  newMockStore( {
				commit: commitMock,
			} );

			const newTerm = { language: 'en', value: 'domesticated mammal raised primarily for its milk' };
			actions[ ENTITY_DESCRIPTION_EDIT ]( context, newTerm );
			expect( commitMock ).toHaveBeenLastCalledWith(
				ENTITY_SET_DESCRIPTION_MUTATION,
				newTerm,
			);
		} );
	} );

	describe( ENTITY_ALIASES_EDIT , () => {
		it( `commits to ${ ENTITY_ALIASES_EDIT_MUTATION }`, () => {
			const context = newMockStore( {
				commit: jest.fn(),
			} );

			const language = 'en';
			const termString1 = 'potato';
			const termString2 = 'spud';
			const expectedTerms = [ { language, value: termString1 }, { language, value: termString2 } ];

			( actions[ ENTITY_ALIASES_EDIT ] )(
				context,
				{language, aliasValues: [ termString1, termString2 ] },
				);
			expect( context.commit ).toHaveBeenCalledWith( ENTITY_ALIASES_EDIT_MUTATION, { language, terms: expectedTerms } );
		} );
	} );

} );
