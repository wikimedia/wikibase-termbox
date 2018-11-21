import { ActionContext, ActionTree } from 'vuex';
import Entity from '@/store/entity/Entity';
import { factory } from '@/common/TermboxFactory';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import { ENTITY_INIT as ENTITY_INIT_MUTATION } from '@/store/entity/mutationTypes';

export const actions: ActionTree<Entity, any> = {

	[ ENTITY_INIT ]( context: ActionContext<Entity, any>, entityId: string ): Promise<void> {
		return factory.getEntityRepository().getFingerprintableEntity( entityId )
			.then( ( entity ) => {
				context.commit( ENTITY_INIT_MUTATION, entity );
			} );
	},

};
