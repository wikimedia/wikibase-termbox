import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
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

Vue.use( Vuex );

export function createStore( services: TermboxServices ) {
	const state: Root = {
		editMode: false,
	};

	const storeBundle: StoreOptions<Root> = {
		state,
		mutations,
		actions,
		modules: {
			[ NS_ENTITY ]: createEntity(
				services.getEntityRepository(),
				services.getEntityEditabilityResolver(),
				services.getWritingEntityRepository(),
			),
			[ NS_USER ]: createUser(
				services.getUserPreferenceRepository(),
			),
			[ NS_LANGUAGE ]: createLanguage(
				services.getLanguageRepository(),
				services.getLanguageTranslationRepository(),
			),
			[ NS_LINKS ]: createLinks(),
			[ NS_MESSAGES ]: createMessages(
				services.getMessagesRepository(),
			),
		},
		strict: process.env.NODE_ENV !== 'production',
	};

	return new Vuex.Store<any>( storeBundle );
}
