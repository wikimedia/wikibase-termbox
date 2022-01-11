import buildApp from '@/common/buildApp';
import TermboxServices from './common/TermboxServices';
import AxiosSpecialPageEntityRepo from './server/data-access/AxiosSpecialPageEntityRepo';
import EntityInitializer from './common/EntityInitializer';
import BundleBoundaryPassingException, { ErrorReason } from '@/server/exceptions/BundleBoundaryPassingException';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import AxiosWikibaseContentLanguagesRepo from './server/data-access/AxiosWikibaseContentLanguagesRepo';
import TranslationLanguageNotFound from './common/data-access/error/TranslationLanguageNotFound';
import ContentLanguagesLanguageTranslationRepo from './server/data-access/ContentLanguagesLanguageTranslationRepo';
import ContentLanguagesLanguageRepo from './server/data-access/ContentLanguagesLanguageRepo';
import AxiosWikibaseMessagesRepo from './server/data-access/AxiosWikibaseMessagesRepo';
import WaitingForLanguageWikibaseContentLanguagesRepo
	from './server/data-access/WaitingForLanguageWikibaseContentLanguagesRepo';
import BundleRendererContext from './server/bundle-renderer/BundleRendererContext';
import { MessageKey } from './common/MessageKey';
import CachingMethodDecorator from './server/data-access/CachingMethodDecorator';
import MessagesRepository from './common/data-access/MessagesRepository';
import MessageTranslationCollection from './datamodel/MessageTranslationCollection';
import WikibaseContentLanguagesRepo, { WikibaseApiContentLanguages }
	from '@/server/data-access/WikibaseContentLanguagesRepo';
import { ConfigOptions } from '@/components/mixins/newConfigMixin';
import EntityRevision from '@/datamodel/EntityRevision';

const config: ConfigOptions = {
	// As of now all config values concern edit mode exclusively, which is not reachable on the server side
	textFieldCharacterLimit: 0,
	licenseAgreementInnerHtml: '',
	copyrightVersion: '',
};

export default ( context: BundleRendererContext ): Promise<unknown> => {
	const services = new TermboxServices();
	const axios = context.services.axios;

	const axiosLanguages = new AxiosWikibaseContentLanguagesRepo( axios );
	const languageRepo = new WaitingForLanguageWikibaseContentLanguagesRepo(
		new CachingMethodDecorator<WikibaseApiContentLanguages>(
			context.services.languageCache,
			axiosLanguages,
			axiosLanguages.getContentLanguages,
		) as unknown as WikibaseContentLanguagesRepo,
	);

	services.set(
		'languageTranslationRepository',
		new ContentLanguagesLanguageTranslationRepo( languageRepo ),
	);

	services.set(
		'languageRepository',
		new ContentLanguagesLanguageRepo( languageRepo ),
	);

	const axiosWikibaseMessagesRepo = new AxiosWikibaseMessagesRepo(
		axios,
		Object.values( MessageKey ),
	);
	services.set(
		'messagesRepository',
		new CachingMethodDecorator<MessageTranslationCollection>(
			context.services.messageCache,
			axiosWikibaseMessagesRepo,
			axiosWikibaseMessagesRepo.getMessagesInLanguage,
		) as unknown as MessagesRepository,
	);

	services.set(
		'entityRepository',
		new AxiosSpecialPageEntityRepo(
			axios,
			new EntityInitializer(),
		),
	);

	services.set(
		'entityEditabilityResolver',
		{
			isEditable() {
				// hiding elements used for editing is done by the consumer of the SSR service
				return Promise.resolve( true );
			},
		},
	);

	services.set(
		'userPreferenceRepository',
		{
			// setting and getting user preferences is not relevant for the SSR output for now
			setPreference: () => Promise.resolve(),
			getPreference: () => Promise.resolve(),
		},
	);

	services.set(
		'writingEntityRepository',
		{
			// ssr does not perform any writing
			saveEntity: () => ( new Error( 'No valid path for SSR.' ) ) as unknown as Promise<EntityRevision>,
		},
	);

	return buildApp(
		context.request,
		services,
		config,
	).catch( ( err: unknown ) => {
		if ( err instanceof EntityNotFound ) {
			throw new BundleBoundaryPassingException( ErrorReason.EntityNotFound, err.getContext() );
		} else if ( err instanceof TranslationLanguageNotFound ) {
			throw new BundleBoundaryPassingException( ErrorReason.LanguageNotFound, err.getContext() );
		}

		throw err;
	} );
};
