import { ActionContext } from 'vuex';
import {
	LANGUAGE_PREFERENCE,
	USER_NAME_SET,
	USER_PREFERENCES_INIT,
	USER_PREFERENCE_SET,
} from './actionTypes';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
	USER_SET_NAME,
	USER_SET_PREFERENCE,
} from './mutationTypes';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import User from '@/store/user/User';
import {
	NS_LANGUAGE,
	NS_MESSAGES,
} from '@/store/namespaces';
import { ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';
import { action } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { UserPreference } from '@/common/UserPreference';
import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export default (
	userPreferenceRepository: UserPreferenceRepository,
) => ( {
	[ LANGUAGE_PREFERENCE ](
		context: ActionContext<User, any>,
		{ primaryLanguage, preferredLanguages }: { primaryLanguage: string; preferredLanguages: string[] },
	): Promise<[ void, void ]> {
		context.commit( LANGUAGE_INIT, primaryLanguage );

		context.commit( SECONDARY_LANGUAGES_INIT, preferredLanguages.filter( ( languageKey: string ) => {
			return languageKey !== primaryLanguage;
		} ) );

		return Promise.all( [
			context.dispatch( action( NS_MESSAGES, MESSAGES_INIT ), primaryLanguage, { root: true } ),
			context.dispatch(
				action( NS_LANGUAGE, ENSURE_AVAILABLE_IN_LANGUAGE ),
				primaryLanguage,
				{ root: true },
			),
		] );
	},

	[ USER_NAME_SET ]( context: ActionContext<User, any>, name: string ) {
		context.commit( USER_SET_NAME, name );
	},

	[ USER_PREFERENCES_INIT ]( context: ActionContext<User, any> ): Promise<void[]> {
		return Promise.all( Object.values( UserPreference ).map( ( preference ) => {
			return userPreferenceRepository.getPreference( preference )
				.then( ( value ) => context.commit(
					USER_SET_PREFERENCE,
					{ name: preference, value },
				) );
		} ) );
	},

	[ USER_PREFERENCE_SET ](
		context: ActionContext<User, any>,
		{ name, value }: { name: UserPreference; value: unknown },
	) {
		return userPreferenceRepository.setPreference( name, value ).then( () => {
			// Only write to the store if persisting the preference was successful in order to avoid inconsistencies
			// between store and preference repository.
			context.commit( USER_SET_PREFERENCE, { name, value } );
		} );
	},
} );
