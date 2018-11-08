import Vue from 'vue';
import init from '@/client/init';

Vue.config.productionTip = false;

init().then( ( app ) => {
	app.$mount( '.wikibase-entitytermsview' );
} );
