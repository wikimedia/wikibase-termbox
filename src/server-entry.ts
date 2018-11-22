import buildApp from '@/common/buildApp';
import { factory } from './common/TermboxFactory';
import WikibaseApiLanguageRepository from './server/data-access/WikibaseApiLanguageRepository';
import TermboxRequest from './common/TermboxRequest';
import MwBotWikibaseRepo from './server/data-access/MwBotWikibaseRepo';
import mwbot from 'mwbot';
import EntityInitializer from './common/EntityInitializer';
import getChildComponents from './common/getChildComponents';

factory.setLanguageRepository( new WikibaseApiLanguageRepository() );
factory.setEntityRepository( new MwBotWikibaseRepo(
	new mwbot( {
		apiUrl: 'http://default.web.mw.localhost/mediawiki/api.php', // TODO
	} ),
	new EntityInitializer(),
) );

export default ( termboxRequest: TermboxRequest ) => {
	return new Promise( ( resolve, reject ) => {
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
			resolve( app );
		} ).catch( reject );
	} );
};
