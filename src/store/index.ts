import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { entity } from '@/store/entity';
import { user } from '@/store/user';
import { language } from '@/store/language';
import { links } from '@/store/links';

Vue.use( Vuex );

export function createStore () {
	const storeBundle: StoreOptions<any> = {
		modules: {
			entity,
			user,
			language,
			links,
		},
		strict: process.env.NODE_ENV !== 'production',
	};

	return new Vuex.Store<any>( storeBundle );
}
