import TermboxRequest from '@/common/TermboxRequest';
import MwWindow from '@/client/mediawiki/MwWindow';

export default () => {
	return new Promise<TermboxRequest>( ( resolve ) => {
		const config = ( window as MwWindow ).mw.config;
		const entityId = config.get( 'wbEntityId' );
		const currentPage = config.get( 'wgPageName' );

		resolve( new TermboxRequest(
			config.get( 'wgUserLanguage' ),
			entityId,
			config.get( 'wgRevisionId' ),
			{
				editLinkUrl: ( new ( window as MwWindow ).mw.Title(
					`SetLabelDescriptionAliases/${entityId}`,
					config.get( 'wgNamespaceIds' ).special,
				) ).getUrl(),
				loginLinkUrl: ( window as MwWindow ).mw.util.getUrl( 'Special:UserLogin', {
					returnto: currentPage,
				} ),
				signUpLinkUrl: ( window as MwWindow ).mw.util.getUrl( 'Special:UserLogin', {
					type: 'signup',
					returnto: currentPage,
				} ),
			},
			( window as MwWindow ).wb.getUserLanguages(),
			config.get( 'wgUserName' ),
		) );
	} );
};
