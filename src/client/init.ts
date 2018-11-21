import TermboxRequest from '@/common/TermboxRequest';
import MwWindow from '@/client/MwWindow';

export default () => {
	return new Promise<TermboxRequest>( ( resolve ) => {
		resolve( new TermboxRequest(
			( window as MwWindow ).mw.config.get( 'wgUserLanguage' ),
			( window as MwWindow ).mw.config.get( 'wbEntityId' ),
		) );
	} );
};
