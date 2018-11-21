import Vue from 'vue';
import init from '@/client/init';
import buildApp from '@/common/buildApp';
import TermboxRequest from '@/common/TermboxRequest';
import { factory } from '@/common/TermboxFactory';
import UlsLanguageRepository from '@/client/data-access/UlsLanguageRepository';
import EntityRepository from '@/client/data-access/EntityRepository';

Vue.config.productionTip = false;

factory.setLanguageRepository( new UlsLanguageRepository() );
factory.setEntityRepository( new EntityRepository() );

function getAllChildren( app: Vue ) {
	const children: Vue[] = [app];

	app.$children.forEach( ( child: Vue ) => {
		children.push( child );
		// TODO: should be recursive
	} );

	return children;
}

init().then( ( termboxRequest: TermboxRequest ) => {
	const { app, store } = buildApp( termboxRequest );

	const componentList = getAllChildren( app );

	Promise.all( componentList.map( ( component ) => {
		if ( ( component.constructor as any ).asyncData ) { // TODO big derp
			return ( component.constructor as any ).asyncData(
				store,
				termboxRequest,
			);
		}
	} ) ).then( () => {
		app.$mount( '.wikibase-entitytermsview' );
	} );
} );
