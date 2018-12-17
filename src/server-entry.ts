import buildApp from '@/common/buildApp';
import { config } from './server/TermboxConfig';
import { factory } from './common/TermboxFactory';
import MwBotWikibaseFingerprintableEntityRepo from './server/data-access/MwBotWikibaseFingerprintableEntityRepo';
import mwbot from 'mwbot';
import EntityInitializer from './common/EntityInitializer';
import BundleBoundaryPassingException, { ErrorReason } from '@/server/exceptions/BundleBoundaryPassingException';
import TermboxRequest from '@/common/TermboxRequest';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import MwBotWikibaseContentLanguagesRepo from './server/data-access/MwBotWikibaseContentLanguagesRepo';
import TranslationLanguageNotFound from './common/data-access/error/TranslationLanguageNotFound';
import ContentLanguagesLanguageTranslationRepo from './server/data-access/ContentLanguagesLanguageTranslationRepo';
import ContentLanguagesLanguageRepo from './server/data-access/ContentLanguagesLanguageRepo';
import WaitingForLanguageWikibaseContentLanguagesRepo
	from './server/data-access/WaitingForLanguageWikibaseContentLanguagesRepo';

export default ( termboxRequest: TermboxRequest ) => {
	const apiBot = new mwbot( {
		apiUrl: config.getWikibaseRepoApi(), // TODO test
	} );

	const languageRepo = new WaitingForLanguageWikibaseContentLanguagesRepo(
		new MwBotWikibaseContentLanguagesRepo(
			apiBot,
		),
	);

	factory.setLanguageTranslationRepository(
		new ContentLanguagesLanguageTranslationRepo( languageRepo ),
	);
	factory.setLanguageRepository(
		new ContentLanguagesLanguageRepo( languageRepo ),
	);
	factory.setEntityRepository(
		new MwBotWikibaseFingerprintableEntityRepo(
			apiBot,
			new EntityInitializer(),
		),
	);

	return buildApp( termboxRequest ).catch( ( err: any ) => {
		if ( err instanceof EntityNotFound ) {
			throw new BundleBoundaryPassingException( ErrorReason.EntityNotFound );
		} else if ( err instanceof TranslationLanguageNotFound ) {
			throw new BundleBoundaryPassingException( ErrorReason.LanguageNotFound );
		}

		throw err;
	} );
};
