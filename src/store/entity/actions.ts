import { ActionContext } from 'vuex';
import EntityState from '@/store/entity/EntityState';
import EntityRepository from '@/common/data-access/EntityRepository';
import EntityEditabilityResolver from '@/common/data-access/EntityEditabilityResolver';
import WritingEntityRepository from '@/common/data-access/WritingEntityRepository';
import {
	ENTITY_INIT,
	ENTITY_LABEL_EDIT,
	ENTITY_ALIASES_EDIT,
	ENTITY_DESCRIPTION_EDIT,
	ENTITY_SAVE,
	ENTITY_ALIAS_REMOVE,
	ENTITY_ROLLBACK,
} from '@/store/entity/actionTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import {
	EDITABILITY_UPDATE,
	ENTITY_UPDATE,
	ENTITY_REVISION_UPDATE,
	ENTITY_SET_ALIASES as ENTITY_ALIASES_EDIT_MUTATION,
	ENTITY_SET_LABEL as SET_ENTITY_LABEL_MUTATION,
	ENTITY_SET_DESCRIPTION as SET_ENTITY_DESCRIPTION_MUTATION,
	ENTITY_REMOVE_ALIAS,
	ENTITY_ROLLBACK as ENTITY_ROLLBACK_MUTATION,
} from '@/store/entity/mutationTypes';
import { Term } from '@wmde/wikibase-datamodel-types';
import EntityRevision from '@/datamodel/EntityRevision';

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export default (
	entityRepository: EntityRepository,
	entityEditabilityResolver: EntityEditabilityResolver,
	writingEntityRepository: WritingEntityRepository,
) => ( {
	[ ENTITY_INIT ](
		context: ActionContext<EntityState, any>,
		payload: { entity: string; revision: number },
	): Promise<void> {
		return Promise.all( [
			entityRepository.getFingerprintableEntity( payload.entity, payload.revision ),
			entityEditabilityResolver.isEditable( payload.entity ),
		] ).then( ( [ entity, isEditable ] ) => {
			context.commit( ENTITY_REVISION_UPDATE, payload.revision );
			context.commit( ENTITY_UPDATE, entity );
			context.commit( EDITABILITY_UPDATE, isEditable );
		} );
	},

	[ ENTITY_SAVE ]( context: ActionContext<EntityState, any> ): Promise<void> {
		return writingEntityRepository.saveEntity( new FingerprintableEntity(
			context.state.id,
			context.state.labels,
			context.state.descriptions,
			context.state.aliases,
		), context.state.baseRevision ).then( ( entityRevision: EntityRevision ) => {
			context.commit( ENTITY_REVISION_UPDATE, entityRevision.revisionId );
			context.commit( ENTITY_UPDATE, entityRevision.entity );
		} );
	},

	[ ENTITY_ROLLBACK ]( context: ActionContext<EntityState, any> ): void {
		context.commit( ENTITY_ROLLBACK_MUTATION );
	},

	[ ENTITY_LABEL_EDIT ]( context: ActionContext<EntityState, any>, label: Term ): void {
		context.commit( SET_ENTITY_LABEL_MUTATION, label );
	},

	[ ENTITY_ALIASES_EDIT ](
		context: ActionContext<EntityState, any>,
		{ language, aliasValues }: { language: string; aliasValues: string[] },
	): void {
		const terms: Term[] = aliasValues.map( ( alias ) => ( { language, value: alias } ) );
		context.commit( ENTITY_ALIASES_EDIT_MUTATION, { language, terms } );
	},

	[ ENTITY_ALIAS_REMOVE ](
		context: ActionContext<EntityState, any>,
		payload: { languageCode: string; index: number },
	) {
		context.commit( ENTITY_REMOVE_ALIAS, payload );
	},

	[ ENTITY_DESCRIPTION_EDIT ]( context: ActionContext<EntityState, any>, description: Term ): void {
		context.commit( SET_ENTITY_DESCRIPTION_MUTATION, description );
	},
} );
