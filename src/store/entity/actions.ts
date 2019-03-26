import { ActionContext } from 'vuex';
import Entity from '@/store/entity/Entity';
import { factory } from '@/common/TermboxFactory';
import {
	ENTITY_INIT,
	ENTITY_LABEL_EDIT,
	ENTITY_ALIASES_EDIT,
	ENTITY_DESCRIPTION_EDIT,
	ENTITY_SAVE,
} from '@/store/entity/actionTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import {
	EDITABILITY_UPDATE,
	ENTITY_INIT as ENTITY_INIT_MUTATION,
	ENTITY_SET_ALIASES as ENTITY_ALIASES_EDIT_MUTATION,
	ENTITY_SET_LABEL as SET_ENTITY_LABEL_MUTATION,
	ENTITY_SET_DESCRIPTION as SET_ENTITY_DESCRIPTION_MUTATION,
} from '@/store/entity/mutationTypes';

import Term from '@/datamodel/Term';

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

	[ ENTITY_LABEL_EDIT ]( context: ActionContext<Entity, any>, payload: { language: string, value: string } ): void {
		const labelTerm: Term = { language: payload.language, value: payload.value };
		context.commit( SET_ENTITY_LABEL_MUTATION, labelTerm );
	},

	[ENTITY_ALIASES_EDIT](
		context: ActionContext<Entity, any>,
		{ language, aliasValues }: { language: string, aliasValues: string[] },
	): void {
		const terms: Term[] = aliasValues.map( ( alias ) => ( { language, value: alias } ) );
		context.commit( ENTITY_ALIASES_EDIT_MUTATION, { language, terms } );
	},

	[ ENTITY_DESCRIPTION_EDIT ](
		context: ActionContext<Entity, any>,
		{ language, value }: { language: string, value: string },
	): void {
		const descriptionTerm: Term = { language, value };
		context.commit( SET_ENTITY_DESCRIPTION_MUTATION, descriptionTerm );
	},

};
