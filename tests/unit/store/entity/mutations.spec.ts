import { mutations } from '@/store/entity/mutations';
import {
	ENTITY_INIT,
} from '@/store/entity/mutationTypes';
import {
	emptyEntityType,
	filledEntity as entity,
} from '../data/EntityStores';
import InvalidEntityException from '@/store/entity/exceptions/InvalidEntityException';

describe( '/store/entity/mutations.ts', () => {
	it( 'it throws an error on initilization if an invalid object is given', () => {
		expect( () => {
			mutations[ENTITY_INIT]( emptyEntityType, '' );
		} ).toThrow( InvalidEntityException );

		expect( () => {
			mutations[ENTITY_INIT]( emptyEntityType, [] );
		} ).toThrow( InvalidEntityException );

		expect( () => {
			mutations[ENTITY_INIT]( emptyEntityType, { id: 'whatEver' } );
		} ).toThrow( InvalidEntityException );
	} );

	it( 'it contains data after initilization', () => {
		function init() {
			mutations[ENTITY_INIT]( emptyEntityType, entity );

			return [
				emptyEntityType.id,
				emptyEntityType.type,
				emptyEntityType.labels,
				emptyEntityType.descriptions,
				emptyEntityType.aliases,
			];
		}

		expect( init() ).toStrictEqual( [
			entity.id,
			entity.type,
			entity.labels,
			entity.descriptions,
			entity.aliases,
		] );
	} );
} );
