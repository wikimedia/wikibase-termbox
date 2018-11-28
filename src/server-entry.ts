import buildApp from '@/common/buildApp';
import { config } from './server/TermboxConfig';
import { factory } from './common/TermboxFactory';
import WikibaseApiLanguageRepository from './server/data-access/WikibaseApiLanguageRepository';
import MwBotWikibaseRepo from './server/data-access/MwBotWikibaseRepo';
import mwbot from 'mwbot';
import EntityInitializer from './common/EntityInitializer';

const apiBot = new mwbot( {
	apiUrl: config.getWikibaseRepoApi(), // TODO test
} );

factory.setLanguageTranslationRepository(
	new WikibaseApiLanguageRepository(
		apiBot,
	),
);
factory.setEntityRepository(
	new MwBotWikibaseRepo(
		apiBot,
		new EntityInitializer(),
	),
);

export default buildApp;
