import init from '@/client/init';
import TermboxRequest from '@/common/TermboxRequest';
import MwWindow from '@/client/mediawiki/MwWindow';
import buildAndAttemptHydration from '@/client/buildAndAttemptHydration';
import initializeConfigAndDefaultServices from '@/client/initializeConfigAndDefaultServices';
import EntityRepository from '@/common/data-access/EntityRepository';
import WritingEntityRepository from '@/common/data-access/WritingEntityRepository';

type ConfigurableServices = {
	readingEntityRepository: EntityRepository;
	writingEntityRepository: WritingEntityRepository;
};

export default ( consumerDefinedServices: ConfigurableServices ): Promise<void> => {
	return init().then( ( termboxRequest: TermboxRequest ) => {
		const { config, services } = initializeConfigAndDefaultServices( window as unknown as MwWindow );
		services.set( 'entityRepository', consumerDefinedServices.readingEntityRepository );
		services.set( 'writingEntityRepository', consumerDefinedServices.writingEntityRepository );

		return buildAndAttemptHydration( termboxRequest, services, config );
	} );
};
