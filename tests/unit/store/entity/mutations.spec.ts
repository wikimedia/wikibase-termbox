import { mutations } from '@/store/entity/mutations';
import {
	ENTITY_INIT,
	EDITABILITY_UPDATE,
} from '@/store/entity/mutationTypes';
import InvalidEntityException from '@/store/entity/exceptions/InvalidEntityException';
import Entity from '@/store/entity/Entity';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

function newEntityState( entity: any = {} ): Entity {
	return {
		id: 'Q1',
		labels: {},
		descriptions: {},
		aliases: {},
		isEditable: false,

		...entity,
	};
}

describe( 'entity/mutations', () => {

	describe( ENTITY_INIT, () => {

		it( 'throws an error if an invalid object is given', () => {
			expect( () => {
				mutations[ENTITY_INIT]( newEntityState(), '' );
			} ).toThrow( InvalidEntityException );

			expect( () => {
				mutations[ENTITY_INIT]( newEntityState(), [] );
			} ).toThrow( InvalidEntityException );

			expect( () => {
				mutations[ENTITY_INIT]( newEntityState(), { id: 'whatever' } );
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

			mutations[ENTITY_INIT]( state, entity );

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

} );
