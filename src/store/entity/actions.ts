import { ActionContext, ActionTree } from 'vuex';
import Entity from '@/store/entity/Entity';
import { factory } from '@/common/TermboxFactory';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import { EDITABILITY_UPDATE, ENTITY_INIT as ENTITY_INIT_MUTATION } from '@/store/entity/mutationTypes';

export const actions: ActionTree<Entity, any> = {

	[ ENTITY_INIT ]( context: ActionContext<Entity, any>, payload: { entity: string, revision: number } ): Promise<void> {
		return Promise.all( [
			factory.getEntityRepository().getFingerprintableEntity( payload.entity, payload.revision ),
			factory.getEntityEditabilityResolver().isEditable( payload.entity ),
		] ).then( ( [ entity, isEditable ] ) => {
			context.commit( ENTITY_INIT_MUTATION, entity );
			context.commit( EDITABILITY_UPDATE, isEditable );
		} );
	},

};
