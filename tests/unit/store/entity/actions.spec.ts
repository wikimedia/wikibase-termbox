import actions from '@/store/entity/actions';
import {
	ENTITY_INIT,
	ENTITY_ALIASES_EDIT,
	ENTITY_ALIAS_REMOVE,
	ENTITY_DESCRIPTION_EDIT,
	ENTITY_LABEL_EDIT,
	ENTITY_SAVE,
	ENTITY_ROLLBACK,
} from '@/store/entity/actionTypes';
import {
	EDITABILITY_UPDATE,
	ENTITY_UPDATE,
	ENTITY_SET_LABEL as ENTITY_SET_LABEL_MUTATION,
	ENTITY_SET_ALIASES as ENTITY_ALIASES_EDIT_MUTATION,
	ENTITY_REMOVE_ALIAS,
	ENTITY_SET_DESCRIPTION as ENTITY_SET_DESCRIPTION_MUTATION,
	ENTITY_REVISION_UPDATE,
	ENTITY_ROLLBACK as ENTITY_ROLLBACK_MUTATION,
} from '@/store/entity/mutationTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import newMockStore from '@wmde/vuex-helpers/dist/newMockStore';
import newFingerprintable from '../../../newFingerprintable';
import EntityRevision from '@/datamodel/EntityRevision';

describe( 'entity/actions', () => {
	describe( ENTITY_INIT, () => {
		it( `commits to ${ENTITY_UPDATE} on successful FingerprintableEntity lookup`, ( done ) => {
			const entityId = 'Q42';
			const revision = 4711;

			const entity = new FingerprintableEntity( entityId, {}, {}, {} );
			const entityRepository = {
				getFingerprintableEntity: ( thisEntityId: string, thisRevision: number ) => {
					expect( thisEntityId ).toBe( entityId );
					expect( thisRevision ).toBe( revision );
					return Promise.resolve( entity );
				},
			};
			const context = newMockStore( {
				commit: jest.fn(),
			} );

			actions(
				entityRepository,
				{ isEditable: jest.fn() },
				{ saveEntity: jest.fn() },
			)[ ENTITY_INIT ]( context, { entity: entityId, revision } ).then( () => {
				expect( context.commit ).toBeCalledWith(
					ENTITY_UPDATE,
					entity,
				);
				done();
			} );
		} );

		it( `commits to ${EDITABILITY_UPDATE} on successful lookup and editability resolution`, () => {
			const isEditable = true;
			const entityEditabilityResolver = {
				isEditable: () => Promise.resolve( isEditable ),
			};

			const context = newMockStore( {
				commit: jest.fn(),
			} );

			return actions(
				{ getFingerprintableEntity: jest.fn() },
				entityEditabilityResolver,
				{ saveEntity: jest.fn() },
			)[ ENTITY_INIT ]( context, { entity: 'Q123', revision: 4711 } ).then( () => {
				expect( context.commit ).toHaveBeenCalledWith( EDITABILITY_UPDATE, isEditable );
			} );
		} );

		it( `commits to ${ENTITY_REVISION_UPDATE} on successful entity lookup`, () => {
			const revision = 4711;
			const context = newMockStore( {
				commit: jest.fn(),
			} );

			return actions(
				{ getFingerprintableEntity: jest.fn() },
				{ isEditable: jest.fn() },
				{ saveEntity: jest.fn() },
			)[ ENTITY_INIT ]( context, { entity: 'Q123', revision } ).then( () => {
				expect( context.commit ).toHaveBeenCalledWith( ENTITY_REVISION_UPDATE, revision );
			} );
		} );

		it( 'propagates lookup rejection', ( done ) => {
			const entityId = 'Q1';
			const revision = 4711;
			const error = new EntityNotFound( 'Entity not found', {} );
			const entityRepository = {
				getFingerprintableEntity: ( thisEntityId: string ) => {
					expect( thisEntityId ).toBe( entityId );
					return Promise.reject( error );
				},
			};

			actions(
				entityRepository,
				{ isEditable: jest.fn() },
				{ saveEntity: jest.fn() },
			)[ ENTITY_INIT ]( newMockStore( {} ), { entity: entityId, revision } )
				.catch( ( thisError: Error ) => {
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

			return actions(
				{ getFingerprintableEntity: jest.fn() },
				{ isEditable: jest.fn() },
				writingRepository,
			)[ ENTITY_SAVE ]( newMockStore( { state } ) ).then( () => {
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
			const store = { commit: jest.fn() };

			return actions(
				{ getFingerprintableEntity: jest.fn() },
				{ isEditable: jest.fn() },
				writingRepository,
			)[ ENTITY_SAVE ]( newMockStore( store ) ).then( () => {
				expect( store.commit )
					.toHaveBeenCalledWith( ENTITY_REVISION_UPDATE, responseEntityRevision.revisionId );
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
			actions(
				{ getFingerprintableEntity: jest.fn() },
				{ isEditable: jest.fn() },
				{ saveEntity: jest.fn() },
			)[ ENTITY_LABEL_EDIT ]( context, newTerm );
			expect( commitMock ).toHaveBeenLastCalledWith(
				ENTITY_SET_LABEL_MUTATION,
				newTerm,
			);
		} );
	} );

	describe( ENTITY_DESCRIPTION_EDIT, () => {
		it( `commits to ${ENTITY_SET_DESCRIPTION_MUTATION} on label update action`, () => {
			const commitMock = jest.fn();
			const context = newMockStore( {
				commit: commitMock,
			} );

			const newTerm = { language: 'en', value: 'domesticated mammal raised primarily for its milk' };
			actions(
				{ getFingerprintableEntity: jest.fn() },
				{ isEditable: jest.fn() },
				{ saveEntity: jest.fn() },
			)[ ENTITY_DESCRIPTION_EDIT ]( context, newTerm );
			expect( commitMock ).toHaveBeenLastCalledWith(
				ENTITY_SET_DESCRIPTION_MUTATION,
				newTerm,
			);
		} );
	} );

	describe( ENTITY_ALIASES_EDIT, () => {
		it( `commits to ${ENTITY_ALIASES_EDIT_MUTATION}`, () => {
			const context = newMockStore( {
				commit: jest.fn(),
			} );

			const language = 'en';
			const termString1 = 'potato';
			const termString2 = 'spud';
			const expectedTerms = [ { language, value: termString1 }, { language, value: termString2 } ];

			actions(
				{ getFingerprintableEntity: jest.fn() },
				{ isEditable: jest.fn() },
				{ saveEntity: jest.fn() },
			)[ ENTITY_ALIASES_EDIT ](
				context,
				{ language, aliasValues: [ termString1, termString2 ] },
			);
			expect( context.commit ).toHaveBeenCalledWith( ENTITY_ALIASES_EDIT_MUTATION, {
				language,
				terms: expectedTerms,
			} );
		} );
	} );

	it( `${ENTITY_ALIAS_REMOVE} commits to ${ENTITY_REMOVE_ALIAS}`, () => {
		const context = newMockStore( { commit: jest.fn() } );
		const payload = { languageCode: 'en', index: 5 };

		actions(
			{ getFingerprintableEntity: jest.fn() },
			{ isEditable: jest.fn() },
			{ saveEntity: jest.fn() },
		)[ ENTITY_ALIAS_REMOVE ]( context, payload );

		expect( context.commit ).toHaveBeenCalledWith( ENTITY_REMOVE_ALIAS, payload );
	} );

	it( `${ENTITY_ROLLBACK} commits to ${ENTITY_ROLLBACK_MUTATION}`, () => {
		const context = newMockStore( { commit: jest.fn() } );

		actions(
			{ getFingerprintableEntity: jest.fn() },
			{ isEditable: jest.fn() },
			{ saveEntity: jest.fn() },
		)[ ENTITY_ROLLBACK ]( context );

		expect( context.commit ).toHaveBeenCalledWith( ENTITY_ROLLBACK_MUTATION );
	} );

} );
