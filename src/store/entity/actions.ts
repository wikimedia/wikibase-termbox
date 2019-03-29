import { ActionContext } from 'vuex';
import Entity from '@/store/entity/Entity';
import { factory } from '@/common/TermboxFactory';
import {
	ENTITY_INIT,
	ENTITY_SAVE,
} from '@/store/entity/actionTypes';
import { EDITABILITY_UPDATE, ENTITY_INIT as ENTITY_INIT_MUTATION } from '@/store/entity/mutationTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

export const actions = {

	[ ENTITY_INIT ]( context: ActionContext<Entity, any>, payload: { entity: string, revision: number } ): Promise<void> {
		return Promise.all( [
			factory.getEntityRepository().getFingerprintableEntity( payload.entity, payload.revision ),
			factory.getEntityEditabilityResolver().isEditable( payload.entity ),
		] ).then( ( [ entity, isEditable ] ) => {
			context.commit( ENTITY_INIT_MUTATION, entity );
			context.commit( EDITABILITY_UPDATE, isEditable );
		} );
	},

	[ ENTITY_SAVE ]( context: ActionContext<Entity, any> ): Promise<void> {
		return factory.getWritingEntityRepository().saveEntity( new FingerprintableEntity(
			context.state.id,
			context.state.labels,
			context.state.descriptions,
			context.state.aliases,
		), /* TODO */ 0 );
	},

};
