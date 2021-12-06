import { mutations } from '@/store/entity/mutations';
import {
	ENTITY_UPDATE,
	EDITABILITY_UPDATE,
	ENTITY_SET_LABEL,
	ENTITY_SET_ALIASES,
	ENTITY_REMOVE_ALIAS,
	ENTITY_SET_DESCRIPTION,
	ENTITY_REVISION_UPDATE,
	ENTITY_ROLLBACK,
} from '@/store/entity/mutationTypes';
import InvalidEntityException from '@/store/entity/exceptions/InvalidEntityException';
import EntityState from '@/store/entity/EntityState';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import { lockState } from '../lockState';

function newEntityState( entity: any = null ): EntityState {
	let state = {
		id: 'Q1',
		baseRevision: 0,
		labels: {},
		descriptions: {},
		aliases: {},
		isEditable: false,
		baseRevisionFingerprint: null,
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

		it( 'contains entity data incl baseRevisionFingerprint after initialization', () => {
			const state: EntityState = newEntityState();
			const entity = new FingerprintableEntity(
				'Q123',
				{ en: { language: 'en', value: 'foo' } },
				{ en: { language: 'en', value: 'foobar' } },
				{ en: [ { language: 'en', value: 'f00bar' } ] },
			);

			mutations[ ENTITY_UPDATE ]( state, entity );

			expect( state.id ).toBe( entity.id );
			expect( state.labels ).toBe( entity.labels );
			expect( state.descriptions ).toBe( entity.descriptions );
			expect( state.aliases ).toBe( entity.aliases );

			expect( state.baseRevisionFingerprint!.labels ).toEqual( entity.labels );
			expect( state.baseRevisionFingerprint!.descriptions ).toEqual( entity.descriptions );
			expect( state.baseRevisionFingerprint!.aliases ).toEqual( entity.aliases );
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

	it( ENTITY_REMOVE_ALIAS, () => {
		const state = newEntityState( {
			aliases: {
				en: [
					{ language: 'en', value: 'foo' },
					{ language: 'en', value: 'bar' },
					{ language: 'en', value: 'baz' },
				],
			},
		} );

		mutations[ ENTITY_REMOVE_ALIAS ]( state, { languageCode: 'en', index: 1 } );

		expect( state.aliases.en ).toEqual( [
			{ language: 'en', value: 'foo' },
			{ language: 'en', value: 'baz' },
		] );
	} );

	describe( ENTITY_ROLLBACK, () => {
		// In theory this can only happen if mutations are added that overlook the baseRevisionFingerprint topic
		it( 'fails with explanation without baseRevisionFingerprint at hand', () => {
			const state = newEntityState( { baseRevisionFingerprint: null } );
			try {
				mutations[ ENTITY_ROLLBACK ]( state, null );
				expect( true ).toBeFalsy();
			} catch ( e_ ) {
				expect( e_ ).toBeInstanceOf( InvalidEntityException );
				const e = e_ as InvalidEntityException;
				expect( e.message ).toBe( 'Entity baseRevisionFingerprint not set' );
			}
		} );

		it( `${ENTITY_ROLLBACK} restores fingerprintable properties from baseRevisionFingerprint`, () => {
			const id = 'Q123';
			const isEditable = true;
			const baseRevision = 0;
			const labels = {
				en: {
					language: 'en',
					value: 'thing',
				},
			};
			const descriptions = {
				en: {
					language: 'en',
					value: 'a thing',
				},
			};
			const aliases = {
				en: [
					{ language: 'en', value: 'foo' },
					{ language: 'en', value: 'bar' },
				],
			};
			const state = newEntityState( {
				id,
				isEditable,
				baseRevision,
				labels: {
					en: {
						language: 'en',
						value: 'a label',
					},
				},
				descriptions: {
					en: {
						language: 'en',
						value: 'a description',
					},
				},
				aliases: {
					en: [
						{ language: 'en', value: 'an alias' },
					],
				},
				baseRevisionFingerprint: {
					labels,
					descriptions,
					aliases,
				},
			} );

			mutations[ ENTITY_ROLLBACK ]( state, null );

			// these are not touched by the rollback, i.e. look like the state was set up
			expect( state.id ).toBe( id );
			expect( state.isEditable ).toBe( isEditable );
			expect( state.baseRevision ).toBe( baseRevision );

			// these _are_ touched by the rollback, i.e. look like the rollback
			expect( state.labels ).toEqual( labels );
			expect( state.descriptions ).toEqual( descriptions );
			expect( state.aliases ).toEqual( aliases );
		} );

		it( `mutations after ${ENTITY_ROLLBACK} do not change the baseRevisionFingerprint value by reference`, () => {
			const baseRevisionLabel = 'thing';
			const state = newEntityState( {
				labels: {
					en: {
						language: 'en',
						value: 'a label',
					},
				},
				baseRevisionFingerprint: {
					labels: {
						en: {
							language: 'en',
							value: baseRevisionLabel,
						},
					},
					descriptions: {},
					aliases: {},
				},
			} );

			mutations[ ENTITY_ROLLBACK ]( state, null );
			mutations[ ENTITY_SET_LABEL ]( state, { language: 'en', value: 'thingyyy' } );

			expect( state.baseRevisionFingerprint!.labels.en.value ).toEqual( baseRevisionLabel );
		} );
	} );

} );
