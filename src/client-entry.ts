import Vue from 'vue';
import init from '@/client/init';
import buildApp from '@/common/buildApp';
import TermboxRequest from '@/common/TermboxRequest';

Vue.config.productionTip = false;

init().then( ( request: TermboxRequest ) => {
	const app = buildApp( request );
	app.$mount( '.wikibase-entitytermsview' );
} );
