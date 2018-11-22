import Vue from 'vue';
import init from '@/client/init';
import buildApp from '@/common/buildApp';
import TermboxRequest from '@/common/TermboxRequest';
import { factory } from '@/common/TermboxFactory';
import UlsLanguageRepository from '@/client/data-access/UlsLanguageRepository';
import EntityRepository from '@/client/data-access/EntityRepository';
import getChildComponents from '@/common/getChildComponents';

Vue.config.productionTip = false;

factory.setLanguageRepository( new UlsLanguageRepository() );
factory.setEntityRepository( new EntityRepository() );

init().then( ( termboxRequest: TermboxRequest ) => {
	const { app, store } = buildApp( termboxRequest );

	const componentList = getChildComponents( app );
	Promise.all( componentList.map( ( componentClass ) => {
		if ( componentClass.asyncData ) {
			return componentClass.asyncData(
				store,
				termboxRequest,
			);
		}
	} ) ).then( () => {
		app.$mount( '.wikibase-entitytermsview' );
	} );
} );
