import Vue from 'vue';
import { MutationTree } from 'vuex';
import Entity from '@/store/entity/Entity';
import {
	EDITABILITY_UPDATE,
	ENTITY_UPDATE,
	ENTITY_SET_LABEL,
	ENTITY_SET_ALIASES,
	ENTITY_SET_DESCRIPTION,
	ENTITY_REVISION_UPDATE,
} from '@/store/entity/mutationTypes';
import InvalidEntityException from '@/store/entity/exceptions/InvalidEntityException';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import Term from '@/datamodel/Term';

export const mutations: MutationTree<Entity> = {
	[ ENTITY_UPDATE ]( state: Entity, entity: FingerprintableEntity ): void {
		if ( !( entity instanceof FingerprintableEntity ) ) {
			throw new InvalidEntityException( JSON.stringify( entity ) );
		}

		state.id = entity.id;
		state.labels = entity.labels;
		state.descriptions = entity.descriptions;
		state.aliases = entity.aliases;
	},

	[ EDITABILITY_UPDATE ]( state: Entity, isEditable: boolean ) {
		state.isEditable = isEditable;
	},

	[ ENTITY_SET_LABEL ]( state: Entity, languageTerm: Term ): void {
		Vue.set( state.labels, languageTerm.language, languageTerm );
	},

	[ ENTITY_SET_ALIASES ]( state: Entity, { language, terms }: { language: string, terms: Term[] } ) {
		Vue.set( state.aliases, language, terms );
	},

	[ ENTITY_SET_DESCRIPTION ]( state: Entity, descriptionTerm: Term ) {
		Vue.set( state.descriptions, descriptionTerm.language, descriptionTerm );
	},

	[ ENTITY_REVISION_UPDATE ]( state: Entity, revision: number ) {
		state.baseRevision = revision;
	},

};
