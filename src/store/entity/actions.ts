import { ActionContext } from 'vuex';
import Entity from '@/store/entity/Entity';
import { factory } from '@/common/TermboxFactory';
import {
	ENTITY_INIT,
	ENTITY_LABEL_EDIT,
	ENTITY_ALIASES_EDIT,
	ENTITY_DESCRIPTION_EDIT,
	ENTITY_SAVE, ENTITY_ALIAS_REMOVE,
} from '@/store/entity/actionTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import {
	EDITABILITY_UPDATE,
	ENTITY_UPDATE,
	ENTITY_REVISION_UPDATE,
	ENTITY_SET_ALIASES as ENTITY_ALIASES_EDIT_MUTATION,
	ENTITY_SET_LABEL as SET_ENTITY_LABEL_MUTATION,
	ENTITY_SET_DESCRIPTION as SET_ENTITY_DESCRIPTION_MUTATION, ENTITY_REMOVE_ALIAS,
} from '@/store/entity/mutationTypes';

import Term from '@/datamodel/Term';
import EntityRevision from '@/datamodel/EntityRevision';

export const actions = {

	[ ENTITY_INIT ](
		context: ActionContext<Entity, any>,
		payload: { entity: string, revision: number },
	): Promise<void> {
		return Promise.all( [
			factory.getEntityRepository().getFingerprintableEntity( payload.entity, payload.revision ),
			factory.getEntityEditabilityResolver().isEditable( payload.entity ),
		] ).then( ( [ entity, isEditable ] ) => {
			context.commit( ENTITY_REVISION_UPDATE, payload.revision );
			context.commit( ENTITY_UPDATE, entity );
			context.commit( EDITABILITY_UPDATE, isEditable );
		} );
	},

	[ ENTITY_SAVE ]( context: ActionContext<Entity, any> ): Promise<EntityRevision> {
		return factory.getWritingEntityRepository().saveEntity( new FingerprintableEntity(
			context.state.id,
			context.state.labels,
			context.state.descriptions,
			context.state.aliases,
		), context.state.baseRevision ).then( ( entityRevision: EntityRevision ) => {
			context.commit( ENTITY_REVISION_UPDATE, entityRevision.revisionId );
			context.commit( ENTITY_UPDATE, entityRevision.entity );

			return entityRevision;
		} );
	},

	[ ENTITY_LABEL_EDIT ]( context: ActionContext<Entity, any>, label: Term ): void {
		context.commit( SET_ENTITY_LABEL_MUTATION, label );
	},

	[ ENTITY_ALIASES_EDIT ](
		context: ActionContext<Entity, any>,
		{ language, aliasValues }: { language: string, aliasValues: string[] },
	): void {
		const terms: Term[] = aliasValues.map( ( alias ) => ( { language, value: alias } ) );
		context.commit( ENTITY_ALIASES_EDIT_MUTATION, { language, terms } );
	},

	[ ENTITY_ALIAS_REMOVE ](
		context: ActionContext<Entity, any>,
		payload: { languageCode: string, index: number }
	) {
		context.commit( ENTITY_REMOVE_ALIAS, payload );
	},

	[ ENTITY_DESCRIPTION_EDIT ]( context: ActionContext<Entity, any>, description: Term ): void {
		context.commit( SET_ENTITY_DESCRIPTION_MUTATION, description );
	},

};
