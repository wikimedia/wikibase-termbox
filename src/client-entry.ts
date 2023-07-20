import init from '@/client/init';
import TermboxRequest from '@/common/TermboxRequest';
import MwWindow from '@/client/mediawiki/MwWindow';
import buildAndAttemptHydration from '@/client/buildAndAttemptHydration';
import initializeConfigAndDefaultServices from '@/client/initializeConfigAndDefaultServices';

export default (): Promise<void> => {
	return init().then( ( termboxRequest: TermboxRequest ) => {
		const { config, services } = initializeConfigAndDefaultServices( window as unknown as MwWindow );
		return buildAndAttemptHydration( termboxRequest, services, config );
	} );
};
