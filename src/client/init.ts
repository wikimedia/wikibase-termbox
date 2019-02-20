import TermboxRequest from '@/common/TermboxRequest';
import MwWindow from '@/client/mediawiki/MwWindow';

export default () => {
	return new Promise<TermboxRequest>( ( resolve ) => {
		const config = ( window as MwWindow ).mw.config;
		const entityId = config.get( 'wbEntityId' );

		resolve( new TermboxRequest(
			config.get( 'wgUserLanguage' ),
			entityId,
			config.get( 'wgRevisionId' ),
			( new ( window as MwWindow ).mw.Title(
				`SetLabelDescriptionAliases/${entityId}`,
				config.get( 'wgNamespaceIds' ).special,
			) ).getUrl(),
			( window as MwWindow ).mw.uls.getFrequentLanguageList(),
		) );
	} );
};
