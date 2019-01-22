import { MutationTree } from 'vuex';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
} from '@/store/user/mutationTypes';
import User from '@/store/user/User';
import InvalidLanguageValueException from '@/store/user/exceptions/InvalidLanguageValueException';

export const mutations: MutationTree<User> = {
	[ LANGUAGE_INIT ] ( state: User, language: string ): void {
		if ( typeof language !== 'string' || language.length < 2 ) {
			throw new InvalidLanguageValueException( 'Invalid primary language.' );
		}

		state.primaryLanguage = language;
	},

	[ SECONDARY_LANGUAGES_INIT ] ( state: User, secondaryLanguages ): void {
		if ( !Array.isArray( secondaryLanguages ) ) {
			throw new InvalidLanguageValueException( 'Invalid secondary languages.' );
		}

		state.secondaryLanguages = secondaryLanguages;
	},
};
