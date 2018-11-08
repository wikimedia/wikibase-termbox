import { MutationTree } from 'vuex';
import EntityClass from '@/common/Entity';
import Entity from '@/store/entity/Entity';
import {
	ENTITY_INIT,
} from '@/store/entity/mutationTypes';
import InvalidEntityException from '@/store/entity/exceptions/InvalidEntityException';

export const mutations: MutationTree<Entity> = {
	[ENTITY_INIT] ( state: Entity, entity: EntityClass ): void {
		if ( !( entity instanceof EntityClass ) ) {
			throw new InvalidEntityException();
		}

		state.id = entity.id;
		state.type = entity.type;
		state.labels = entity.labels;
		state.descriptions = entity.descriptions;
		state.aliases = entity.aliases;
	},
};
