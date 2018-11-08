import { GetterTree } from 'vuex';
import Entity from '@/store/entity/Entity';
import Dictionary from '@/common/interfaces/Dictionary';

export const getters: GetterTree<Entity, any> = {
	id( state: Entity ): string {
		return state.id;
	},
	type( state: Entity ): string {
		return state.type;
	},
	labels( state: Entity ): Dictionary<string> {
		return state.labels;
	},
	descriptions( state: Entity ): Dictionary<string> {
		return state.descriptions;
	},
	aliases( state: Entity ): Dictionary<string[]> {
		return state.aliases;
	},
	getLabelByLanguage: ( state: Entity ) => ( languageCode: string ): string => {
		let label: string = '';

		if ( state.labels.hasOwnProperty( languageCode ) ) {
			label = state.labels[ languageCode ];
		}

		return label;
	},
	getDescriptionByLanguage: ( state: Entity ) => ( languageCode: string ): string => {
		let description: string = '';

		if ( state.labels.hasOwnProperty( languageCode ) ) {
			description = state.descriptions[ languageCode ];
		}

		return description;
	},
	getAliasesByLanguage: ( state: Entity ) => ( languageCode: string ): string[] => {
		let aliases: string[] = [];

		if ( state.labels.hasOwnProperty( languageCode ) ) {
			aliases = state.aliases[ languageCode ];
		}
		return aliases;
	},
};
