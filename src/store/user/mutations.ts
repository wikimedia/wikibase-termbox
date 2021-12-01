import { MutationTree } from 'vuex';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
	USER_SET_NAME,
	USER_SET_PREFERENCE,
} from '@/store/user/mutationTypes';
import User from '@/store/user/User';
import InvalidLanguageValueException from '@/store/user/exceptions/InvalidLanguageValueException';
import { UserPreference } from '@/common/UserPreference';

export const mutations: MutationTree<User> = {
	[ LANGUAGE_INIT ]( state: User, language: string ): void {
		if ( typeof language !== 'string' || language.length < 2 ) {
			throw new InvalidLanguageValueException( 'Invalid primary language.' );
		}

		state.primaryLanguage = language;
	},

	[ SECONDARY_LANGUAGES_INIT ]( state: User, secondaryLanguages: string[] ): void {
		if ( !Array.isArray( secondaryLanguages ) ) {
			throw new InvalidLanguageValueException( 'Invalid secondary languages.' );
		}

		state.secondaryLanguages = secondaryLanguages;
	},

	[ USER_SET_NAME ]( state: User, name: string ) {
		state.name = name;
	},

	[ USER_SET_PREFERENCE ]( state: User, { name, value }: { name: UserPreference; value: unknown } ) {
		state.preferences[ name ] = value;
	},
};
