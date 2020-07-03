import { GetterTree } from 'vuex';
import EntityState from '@/store/entity/EntityState';
import { Term } from '@wmde/wikibase-datamodel-types';

export const getters: GetterTree<EntityState, any> = {
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
