import buildApp from '@/common/buildApp';
import TermboxServices from '@/common/TermboxServices';
import TermboxRequest from '@/common/TermboxRequest';
import { ConfigOptions } from '@/components/mixins/newConfigMixin';

export default function buildAndAttemptHydration(
	termboxRequest: TermboxRequest,
	termboxRootSelector: string,
	services: TermboxServices,
	config: ConfigOptions,
): Promise<void> {
	const buildAndMount = (): Promise<void> => {
		return buildApp( termboxRequest, services, config ).then( ( app ) => {
			app.mount( termboxRootSelector );
		} );
	};

	return buildAndMount().catch( () => {
		// The cause of the original `mount` to fail is likely that there is a mismatch between server-side and
		// client-side rendered markup. In that case, we need to rebuild the app, and mount it without attempting to
		// hydrate.
		( document.querySelector( termboxRootSelector ) as Element )
			.removeAttribute( 'data-server-rendered' );
		return buildAndMount();
	} );
}
