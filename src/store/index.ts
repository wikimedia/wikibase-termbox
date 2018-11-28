import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { entity } from '@/store/entity';
import { user } from '@/store/user';
import { language } from '@/store/language';

Vue.use( Vuex );

// any should be replaced if root gets properties
const storeBundle: StoreOptions<any> = {
	modules: {
		entity,
		user,
		language,
	},
	strict: process.env.NODE_ENV !== 'production',
};

export default new Vuex.Store<any>( storeBundle );
