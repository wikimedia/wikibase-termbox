import Vue from 'vue';
import buildApp from '@/common/buildApp';
import { factory } from './common/TermboxFactory';
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
import { MessageKeys } from '@/common/MessageKeys';
import CachingMethodDecorator from './server/data-access/CachingMethodDecorator';
import MessagesRepository from './common/data-access/MessagesRepository';
import MessageTranslationCollection from './datamodel/MessageTranslationCollection';
import newConfigMixin from '@/components/mixins/newConfigMixin';

Vue.mixin( newConfigMixin( {
	textFieldCharacterLimit: 0, // edit mode is not reachable on the server side
} ) );

export default ( context: BundleRendererContext ) => {
	const axios = context.services.axios;

	const languageRepo = new WaitingForLanguageWikibaseContentLanguagesRepo(
		new AxiosWikibaseContentLanguagesRepo(
			axios,
		),
	);

	factory.setLanguageTranslationRepository(
		new ContentLanguagesLanguageTranslationRepo( languageRepo ),
	);

	factory.setLanguageRepository(
		new ContentLanguagesLanguageRepo( languageRepo ),
	);
	const axiosWikibaseMessagesRepo = new AxiosWikibaseMessagesRepo(
		axios,
		Object.values( MessageKeys ),
	);
	factory.setMessagesRepository( new CachingMethodDecorator<MessageTranslationCollection>(
		context.services.messageCache,
		axiosWikibaseMessagesRepo,
		axiosWikibaseMessagesRepo.getMessagesInLanguage,
	) as any as MessagesRepository );

	factory.setEntityRepository(
		new AxiosSpecialPageEntityRepo(
			axios,
			new EntityInitializer(),
		),
	);
	factory.setEntityEditabilityResolver( {
		isEditable() {
			// hiding elements used for editing is done by the consumer of the SSR service
			return Promise.resolve( true );
		},
	} );

	return buildApp( context.request ).catch( ( err: any ) => {
		if ( err instanceof EntityNotFound ) {
			throw new BundleBoundaryPassingException( ErrorReason.EntityNotFound );
		} else if ( err instanceof TranslationLanguageNotFound ) {
			throw new BundleBoundaryPassingException( ErrorReason.LanguageNotFound );
		}

		throw err;
	} );
};
