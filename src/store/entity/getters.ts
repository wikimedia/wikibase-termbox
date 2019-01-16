import { GetterTree } from 'vuex';
import Entity from '@/store/entity/Entity';
import TermList from '@/datamodel/TermList';
import AliasesList from '@/datamodel/AliasesList';
import Term from '@/datamodel/Term';

export const getters: GetterTree<Entity, any> = {
	id( state: Entity ): string {
		return state.id;
	},
	labels( state: Entity ): TermList {
		return state.labels;
	},
	descriptions( state: Entity ): TermList {
		return state.descriptions;
	},
	aliases( state: Entity ): AliasesList {
		return state.aliases;
	},
	getLabelByLanguage: ( state: Entity ) => ( languageCode: string ): Term | null => {
		return state.labels[ languageCode ] || null;
	},
	getDescriptionByLanguage: ( state: Entity ) => ( languageCode: string ): Term | null => {
		return state.descriptions[ languageCode ] || null;
	},
	getAliasesByLanguage: ( state: Entity ) => ( languageCode: string ): Term[] | null => {
		return state.aliases[ languageCode ] || null;
	},
	getAllEnteredLanguageCodes: ( state: Entity ): string[] => {
		return [
			...new Set( [
				...Object.keys( state.labels ),
				...Object.keys( state.descriptions ),
				...Object.keys( state.aliases ),
			] ),
		].sort();
	},
};
