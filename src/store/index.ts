import { StoreOptions, Store } from 'vuex';
import TermboxServices from '@/common/TermboxServices';
import createEntity from './entity';
import createUser from './user';
import createLanguage from './language';
import createLinks from './links';
import createMessages from './messages';
import Root from './Root';
import { mutations } from './mutations';
import { actions } from './actions';
import {
	NS_ENTITY,
	NS_LANGUAGE,
	NS_LINKS,
	NS_MESSAGES,
	NS_USER,
} from '@/store/namespaces';

export function createStore( services: TermboxServices ): Store<Root> {
	const storeBundle: StoreOptions<Root> = {
		state(): Root {
			return {
				editMode: false,
			};
		},
		mutations,
		actions,
		modules: {
			[ NS_ENTITY ]: createEntity(
				services.get( 'entityRepository' ),
				services.get( 'entityEditabilityResolver' ),
				services.get( 'writingEntityRepository' ),
			),
			[ NS_USER ]: createUser(
				services.get( 'userPreferenceRepository' ),
			),
			[ NS_LANGUAGE ]: createLanguage(
				services.get( 'languageRepository' ),
				services.get( 'languageTranslationRepository' ),
			),
			[ NS_LINKS ]: createLinks(),
			[ NS_MESSAGES ]: createMessages(
				services.get( 'messagesRepository' ),
			),
		},
		strict: process.env.NODE_ENV !== 'production',
	};

	return new Store<Root>( storeBundle );
}
