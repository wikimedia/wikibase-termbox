import buildApp from '@/common/buildApp';
import { factory } from './common/TermboxFactory';
import WikibaseApiLanguageRepository from './server/data-access/WikibaseApiLanguageRepository';
import TermboxRequest from './common/TermboxRequest';
import { Vue } from 'vue/types/vue';
import MwBotWikibaseRepo from './server/data-access/MwBotWikibaseRepo';
import mwbot from 'mwbot';
import EntityInitializer from './common/EntityInitializer';

factory.setLanguageRepository( new WikibaseApiLanguageRepository() );
factory.setEntityRepository( new MwBotWikibaseRepo(
	new mwbot( {
		apiUrl: 'http://default.web.mw.localhost/mediawiki/api.php', // TODO
	} ),
	new EntityInitializer(),
) );

function getAllChildren( app: Vue ) {
	const children: Vue[] = [ app ];

	app.$children.forEach( ( child: Vue ) => {
		children.push( child );
		// TODO: should be recursive
	} );

	return children;
}

export default ( termboxRequest: TermboxRequest ) => {
	return new Promise( ( resolve, reject ) => {
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
			resolve( app );
		} ).catch( reject );
	} );
};
