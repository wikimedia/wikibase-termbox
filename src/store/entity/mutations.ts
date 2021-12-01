import { MutationTree } from 'vuex';
import EntityState from '@/store/entity/EntityState';
import {
	EDITABILITY_UPDATE,
	ENTITY_UPDATE,
	ENTITY_SET_LABEL,
	ENTITY_SET_ALIASES,
	ENTITY_SET_DESCRIPTION,
	ENTITY_REVISION_UPDATE,
	ENTITY_REMOVE_ALIAS,
	ENTITY_ROLLBACK,
} from '@/store/entity/mutationTypes';
import InvalidEntityException from '@/store/entity/exceptions/InvalidEntityException';
import { Fingerprintable, Term } from '@wmde/wikibase-datamodel-types';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

function getFingerprintProperties( source: Fingerprintable ): Fingerprintable {
	return {
		labels: source.labels,
		descriptions: source.descriptions,
		aliases: source.aliases,
	};
}

function clone( source: Fingerprintable ): Fingerprintable {
	return JSON.parse( JSON.stringify( source ) );
}

export const mutations: MutationTree<EntityState> = {
	[ ENTITY_UPDATE ]( state: EntityState, entity: FingerprintableEntity ): void {
		if ( !( entity instanceof FingerprintableEntity ) ) {
			throw new InvalidEntityException( JSON.stringify( entity ) );
		}

		const fingerprintProperties = getFingerprintProperties( entity );

		state.id = entity.id;
		Object.assign( state, fingerprintProperties );

		state.baseRevisionFingerprint = clone( fingerprintProperties );
	},

	[ ENTITY_ROLLBACK ]( state: EntityState ): void {
		if ( state.baseRevisionFingerprint === null ) {
			throw new InvalidEntityException( 'Entity baseRevisionFingerprint not set' );
		}

		Object.assign(
			state,
			clone( state.baseRevisionFingerprint ), // avoid modification after rollback
		);
	},

	[ EDITABILITY_UPDATE ]( state: EntityState, isEditable: boolean ) {
		state.isEditable = isEditable;
	},

	[ ENTITY_SET_LABEL ]( state: EntityState, languageTerm: Term ): void {
		state.labels[ languageTerm.language ] = languageTerm;
	},

	[ ENTITY_SET_ALIASES ]( state: EntityState, { language, terms }: { language: string; terms: Term[] } ) {
		state.aliases[ language ] = terms;
	},

	[ ENTITY_REMOVE_ALIAS ]( state: EntityState, { languageCode, index }: { languageCode: string; index: number } ) {
		state.aliases[ languageCode ].splice( index, 1 );
	},

	[ ENTITY_SET_DESCRIPTION ]( state: EntityState, descriptionTerm: Term ) {
		state.descriptions[ descriptionTerm.language ] = descriptionTerm;
	},

	[ ENTITY_REVISION_UPDATE ]( state: EntityState, revision: number ) {
		state.baseRevision = revision;
	},

};
