import buildApp from '@/common/buildApp';
import { config } from './server/TermboxConfig';
import { factory } from './common/TermboxFactory';
import WikibaseApiLanguageRepository from './server/data-access/WikibaseApiLanguageRepository';
import MwBotWikibaseRepo from './server/data-access/MwBotWikibaseRepo';
import mwbot from 'mwbot';
import EntityInitializer from './common/EntityInitializer';

const WIKIBASE_REPO_API = config.getWikibaseRepoApi(); // TODO test

factory.setLanguageTranslationRepository( new WikibaseApiLanguageRepository(
	new mwbot( {
		apiUrl: WIKIBASE_REPO_API,
	} ),
) );
factory.setEntityRepository( new MwBotWikibaseRepo(
	new mwbot( {
		apiUrl: WIKIBASE_REPO_API,
	} ),
	new EntityInitializer(),
) );

export default buildApp;
