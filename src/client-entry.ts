import Vue from 'vue';
import init from '@/client/init';
import buildApp from '@/common/buildApp';
import TermboxRequest from '@/common/TermboxRequest';
import { factory } from '@/common/TermboxFactory';
import UlsLanguageTranslationRepository from '@/client/data-access/UlsLanguageTranslationRepository';
import EntityRepository from '@/client/data-access/EntityRepository';
import getChildComponents from '@/common/getChildComponents';
import MwWindow from './client/MwWindow';

Vue.config.productionTip = false;

factory.setLanguageTranslationRepository(
	new UlsLanguageTranslationRepository( ( window as MwWindow ).wb.getLanguageNameByCode ),
);
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
