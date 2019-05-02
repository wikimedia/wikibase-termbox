import { GetterTree } from 'vuex';
import EntityState from '@/store/entity/EntityState';
import TermList from '@/datamodel/TermList';
import AliasesList from '@/datamodel/AliasesList';
import Term from '@/datamodel/Term';

export const getters: GetterTree<EntityState, any> = {
	id( state: EntityState ): string {
		return state.id;
	},
	labels( state: EntityState ): TermList {
		return state.labels;
	},
	descriptions( state: EntityState ): TermList {
		return state.descriptions;
	},
	aliases( state: EntityState ): AliasesList {
		return state.aliases;
	},
	getLabelByLanguage: ( state: EntityState ) => ( languageCode: string ): Term | null => {
		return state.labels[ languageCode ] || null;
	},
	getDescriptionByLanguage: ( state: EntityState ) => ( languageCode: string ): Term | null => {
		return state.descriptions[ languageCode ] || null;
	},
	getAliasesByLanguage: ( state: EntityState ) => ( languageCode: string ): Term[] | null => {
		return state.aliases[ languageCode ] || null;
	},
	getAllEnteredLanguageCodes: ( state: EntityState ): string[] => {
		return [
			...new Set( [
				...Object.keys( state.labels ),
				...Object.keys( state.descriptions ),
				...Object.keys( state.aliases ),
			] ),
		].sort();
	},
};
