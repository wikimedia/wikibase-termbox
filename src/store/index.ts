import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { entity } from '@/store/entity/index';
import { user } from '@/store/user/index';

Vue.use( Vuex );

// any should be replaces if root gets properties
const storeBundle: StoreOptions<any> = {
	modules: {
		entity,
		user,
	},
	strict: process.env.NODE_ENV !== 'production',
};

export default new Vuex.Store<any>( storeBundle );
