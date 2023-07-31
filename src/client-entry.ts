import init from '@/client/init';
import TermboxRequest from '@/common/TermboxRequest';
import MwWindow from '@/client/mediawiki/MwWindow';
import initializeConfigAndDefaultServices from '@/client/initializeConfigAndDefaultServices';
import EntityRepository from '@/common/data-access/EntityRepository';
import WritingEntityRepository from '@/common/data-access/WritingEntityRepository';
import buildApp from '@/common/buildApp';
import { App } from '@vue/runtime-core';

type ConfigurableServices = {
	readingEntityRepository: EntityRepository;
	writingEntityRepository: WritingEntityRepository;
};

export default ( consumerDefinedServices: ConfigurableServices, isEditable: boolean ): Promise<App> => {
	return init().then( ( termboxRequest: TermboxRequest ) => {
		const { config, services } = initializeConfigAndDefaultServices( window as unknown as MwWindow );
		services.set( 'entityRepository', consumerDefinedServices.readingEntityRepository );
		services.set( 'writingEntityRepository', consumerDefinedServices.writingEntityRepository );
		services.set(
			'entityEditabilityResolver',
			{ isEditable() { return Promise.resolve( isEditable ); } },
		);

		return buildApp( termboxRequest, services, config );
	} );
};
