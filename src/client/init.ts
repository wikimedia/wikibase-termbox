import TermboxRequest from '@/common/TermboxRequest';
import MwWindow from '@/client/mediawiki/MwWindow';

export default function (): Promise<TermboxRequest> {
	return new Promise<TermboxRequest>( ( resolve ) => {
		const mwWindow = window as unknown as MwWindow;
		const config = mwWindow.mw.config;
		const entityId = config.get( 'wbEntityId' );
		const currentPage = config.get( 'wgPageName' );

		resolve( new TermboxRequest(
			config.get( 'wgUserLanguage' ),
			entityId,
			config.get( 'wgRevisionId' ),
			{
				editLinkUrl: ( new mwWindow.mw.Title(
					`SetLabelDescriptionAliases/${entityId}`,
					config.get( 'wgNamespaceIds' ).special,
				) ).getUrl(),
				loginLinkUrl: mwWindow.mw.util.getUrl( 'Special:UserLogin', {
					returnto: currentPage,
				} ),
				signUpLinkUrl: mwWindow.mw.util.getUrl( 'Special:UserLogin', {
					type: 'signup',
					returnto: currentPage,
				} ),
			},
			mwWindow.wb.getUserLanguages(),
			config.get( 'wgUserName' ),
		) );
	} );
}
