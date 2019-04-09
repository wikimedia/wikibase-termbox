import { mutations } from '@/store/entity/mutations';
import {
	ENTITY_UPDATE,
	EDITABILITY_UPDATE,
	ENTITY_SET_LABEL,
	ENTITY_SET_ALIASES,
	ENTITY_SET_DESCRIPTION,
	ENTITY_REVISION_UPDATE,
} from '@/store/entity/mutationTypes';
import InvalidEntityException from '@/store/entity/exceptions/InvalidEntityException';
import Entity from '@/store/entity/Entity';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import { lockState } from '../lockState';

function newEntityState( entity: any = null ): Entity {
	let state = {
		id: 'Q1',
		baseRevision: 0,
		labels: {},
		descriptions: {},
		aliases: {},
		isEditable: false,
	};

	if ( entity !== null ) {
		state = { ...state, ...entity };
		lockState( state );
	}

	return state;
}

describe( 'entity/mutations', () => {

	describe( ENTITY_UPDATE, () => {

		it( 'throws an error if an invalid object is given', () => {
			expect( () => {
				mutations[ ENTITY_UPDATE ]( newEntityState(), '' );
			} ).toThrow( InvalidEntityException );

			expect( () => {
				mutations[ ENTITY_UPDATE ]( newEntityState(), [] );
			} ).toThrow( InvalidEntityException );

			expect( () => {
				mutations[ ENTITY_UPDATE ]( newEntityState(), { id: 'whatever' } );
			} ).toThrow( InvalidEntityException );
		} );

		it( 'contains entity data after initialization', () => {
			const state: Entity = newEntityState();
			const entity = new FingerprintableEntity(
				'Q123',
				{ en: { language: 'en', value: 'foo' } },
				{ en: { language: 'en', value: 'foobar' } },
				{ en: [ { language: 'en', value: 'f00bar' } ] },
			);

			mutations[ ENTITY_UPDATE ]( state, entity );

			expect( state.labels ).toBe( entity.labels );
			expect( state.id ).toBe( entity.id );
			expect( state.labels ).toBe( entity.labels );
			expect( state.descriptions ).toBe( entity.descriptions );
			expect( state.aliases ).toBe( entity.aliases );
		} );

	} );

	it( EDITABILITY_UPDATE, () => {
		const state = newEntityState( { isEditable: false } );

		mutations[ EDITABILITY_UPDATE ]( state, true );
		expect( state.isEditable ).toBe( true );

		mutations[ EDITABILITY_UPDATE ]( state, false );
		expect( state.isEditable ).toBe( false );
	} );

	describe( ENTITY_SET_LABEL, () => {
		it( 'creates a new label in a language if none exists', () => {
			const language = 'de';
			const newLabel = 'freizeit';
			const store = newEntityState();

			const newTerm = { language, value: newLabel };
			mutations[ ENTITY_SET_LABEL ]( store, newTerm );
			expect( store.labels[ language ] ).toBe( newTerm );
		} );

		it( 'overwrites a label in a language if one exists', () => {
			const language = 'de';
			const newLabel = 'Freizeit';
			const store = newEntityState( {
				labels: {
					[ language ]: {
						language,
						value: 'Arbeit',
					},
				},
			} );
			const newTerm = { language, value: newLabel };
			mutations[ ENTITY_SET_LABEL ]( store, newTerm );
			expect( store.labels[ language ] ).toBe( newTerm );
		} );

	} );

	describe( ENTITY_SET_DESCRIPTION, () => {
		it( 'creates a new description in a language if none exists', () => {
			const language = 'fr';
			const newDescription = 'a new thing';
			const state = newEntityState();

			const newTerm = { language, value: newDescription };
			mutations[ ENTITY_SET_DESCRIPTION ]( state, newTerm );
			expect( state.descriptions[ language ] ).toBe( newTerm );
		} );

		it( 'overwrites a description in a language if one exists', () => {
			const language = 'en';
			const newDescription = 'a new thing';
			const state = newEntityState( {
				descriptions: {
					[ language ]: {
						language,
						value: 'an old thing',
					},
				},
			} );

			const newTerm = { language, value: newDescription };
			mutations[ ENTITY_SET_DESCRIPTION ]( state, newTerm );
			expect( state.descriptions[ language ] ).toBe( newTerm );
		} );
	} );

	describe( ENTITY_SET_ALIASES, () => {
		it( 'creates a new entry if there are no aliases in the language', () => {
			const state = newEntityState();
			const language = 'en';
			const terms = [ { language, value: 'hat' } ];

			mutations[ ENTITY_SET_ALIASES ]( state, { language, terms } );
			expect( state.aliases[ language ] ).toBe( terms );
		} );

		it( 'overwrites the existing aliases in the language', () => {
			const language = 'en';
			const state = newEntityState( {
				aliases: {
					en: [
						{ language, value: 'red' },
					],
				},
			} );

			const newTerms = [ { language, value: 'hat' } ];

			mutations[ ENTITY_SET_ALIASES ]( state, { language, terms: newTerms } );
			expect( state.aliases[ language ] ).toBe( newTerms );

		} );

	} );
	it( ENTITY_REVISION_UPDATE, () => {
		const state = newEntityState( { revision: 0 } );
		const revision = 4711;
		mutations[ ENTITY_REVISION_UPDATE ]( state, revision );
		expect( state.baseRevision ).toBe( revision );
	} );

} );
