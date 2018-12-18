import { mutations } from '@/store/entity/mutations';
import {
	ENTITY_INIT,
} from '@/store/entity/mutationTypes';
import InvalidEntityException from '@/store/entity/exceptions/InvalidEntityException';
import Entity from '@/store/entity/Entity';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

function newMinimalStore(): Entity {
	return {
		id: 'Q1',
		labels: {},
		descriptions: {},
		aliases: {},
	};
}

describe( 'entity/mutations', () => {

	describe( ENTITY_INIT, () => {

		it( 'throws an error if an invalid object is given', () => {
			expect( () => {
				mutations[ENTITY_INIT]( newMinimalStore(), '' );
			} ).toThrow( InvalidEntityException );

			expect( () => {
				mutations[ENTITY_INIT]( newMinimalStore(), [] );
			} ).toThrow( InvalidEntityException );

			expect( () => {
				mutations[ENTITY_INIT]( newMinimalStore(), { id: 'whatever' } );
			} ).toThrow( InvalidEntityException );
		} );

		it( 'contains entity data after initialization', () => {
			const store: Entity = newMinimalStore();
			const entity = new FingerprintableEntity(
				'Q123',
				{ en: { language: 'en', value: 'foo' } },
				{ en: { language: 'en', value: 'foobar' } },
				{ en: [ { language: 'en', value: 'f00bar' } ] },
			);

			mutations[ENTITY_INIT]( store, entity );

			expect( store.labels ).toBe( entity.labels );
			expect( store.id ).toBe( entity.id );
			expect( store.labels ).toBe( entity.labels );
			expect( store.descriptions ).toBe( entity.descriptions );
			expect( store.aliases ).toBe( entity.aliases );
		} );

	} );

} );
