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
			entity: createEntity(),
			user: createUser(),
			language: createLanguage(),
			links: createLinks(),
			messages: createMessages(),
		},
		strict: process.env.NODE_ENV !== 'production',
	};

	return new Vuex.Store<any>( storeBundle );
}
