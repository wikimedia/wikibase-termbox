import Vue from 'vue';
import init from '@/client/init';
import buildApp from '@/common/buildApp';
import TermboxRequest from '@/common/TermboxRequest';
import { instance } from '@/common/TermboxFactory';
import UlsLanguageRepository from '@/client/data-access/UlsLanguageRepository';

Vue.config.productionTip = false;

instance.setLanguageRepository( new UlsLanguageRepository() );

init().then( ( request: TermboxRequest ) => {
	const app = buildApp( request );
	app.$mount( '.wikibase-entitytermsview' );
} );
