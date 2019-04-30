import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
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

export function createStore() {
	const state: Root = {
		editMode: false,
	};

	const storeBundle: StoreOptions<Root> = {
		state,
		mutations,
		actions,
		modules: {
			[ NS_ENTITY ]: createEntity(),
			[ NS_USER ]: createUser(),
			[ NS_LANGUAGE ]: createLanguage(),
			[ NS_LINKS ]: createLinks(),
			[ NS_MESSAGES ]: createMessages(),
		},
		strict: process.env.NODE_ENV !== 'production',
	};

	return new Vuex.Store<any>( storeBundle );
}
