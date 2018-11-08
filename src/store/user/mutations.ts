import { MutationTree } from 'vuex';
import {
	LANGUAGE_INIT,
} from '@/store/user/mutationTypes';
import User from '@/store/user/User';
import InvalidLanguageValueException from '@/store/user/exceptions/InvalidLanguageValueException';

export const mutations: MutationTree<User> = {
	[LANGUAGE_INIT] ( state: User, language: string ): void {
		if ( typeof language !== 'string' || language.length < 2 ) {
			throw new InvalidLanguageValueException();
		}

		state.primaryLanguage = language;
	},
};
