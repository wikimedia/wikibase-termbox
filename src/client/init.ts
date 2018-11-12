import EntityInitializer from '@/common/EntityInitializer';
import TermboxRequest from '@/common/TermboxRequest';
import MwWindow from '@/client/MwWindow';

export default () => {
	return new Promise<TermboxRequest>( ( resolve ) => {
		( window as MwWindow ).mw.hook( 'wikibase.entityPage.entityLoaded' ).add( ( entity: any ) => {
			resolve( new TermboxRequest(
				( window as MwWindow ).mw.config.get( 'wgUserLanguage' ),
				( new EntityInitializer() ).newFromSerialization( entity ),
			) );
		} );
	} );
};
