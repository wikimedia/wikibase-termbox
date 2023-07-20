import MwWindow from '@/client/mediawiki/MwWindow';
import { ConfigOptions } from '@/components/mixins/newConfigMixin';
import EntityInitializer from '@/common/EntityInitializer';
import TermboxServices from '@/common/TermboxServices';
import UlsLanguageTranslationRepository from '@/client/data-access/UlsLanguageTranslationRepository';
import UlsLanguageRepository from '@/client/data-access/UlsLanguageRepository';
import MessagesRepository from '@/client/data-access/MessagesRepository';
import { MessageKey } from '@/common/MessageKey';
import EntityRepository from '@/client/data-access/EntityRepository';
import { Hooks } from '@/client/mediawiki/Hooks';
import axiosFactory from '@/client/axios/axiosFactory';
import AxiosWritingEntityRepository from '@/client/data-access/AxiosWritingEntityRepository';
import termboxConfig from '@/config.json'; // in production, this file is provided by ResourceLoader
import DispatchingUserPreferenceRepository from '@/common/data-access/DispatchingUserPreferenceRepository';
import { UserPreference } from '@/common/UserPreference';
import CookieUserPreferenceRepository from '@/client/data-access/CookieUserPreferenceRepository';
import BooleanCookieStore from '@/client/data-access/BooleanCookieStore';
import StringMWCookieStore from '@/client/data-access/StringMWCookieStore';
import DelegatingUserPreferenceRepository from '@/common/data-access/DelegatingUserPreferenceRepository';
import CompoundUserPreferenceRepository from '@/common/data-access/CompoundUserPreferenceRepository';
import MWUserOptionsReadingSingleUserPreferenceRepository
	from '@/client/data-access/MWUserOptionsReadingSingleUserPreferenceRepository';
import AxiosWritingSingleUserPreferenceRepository
	from '@/client/data-access/AxiosWritingSingleUserPreferenceRepository';

export default function ( mwWindow: MwWindow ): { config: ConfigOptions, services: TermboxServices } {
	const config: ConfigOptions = {
		textFieldCharacterLimit: mwWindow.mw.config.get( 'wbMultiLingualStringLimit' ),
		licenseAgreementInnerHtml: mwWindow.mw.config.get( 'wbCopyright' ).messageHtml,
		copyrightVersion: mwWindow.mw.config.get( 'wbCopyright' ).version,
	};

	const contentLanguages = mwWindow.wb.WikibaseContentLanguages.getTermLanguages();
	const entityInitializer = new EntityInitializer();
	const services = new TermboxServices();

	services.set(
		'languageTranslationRepository',
		new UlsLanguageTranslationRepository(
			contentLanguages,
		),
	);

	services.set(
		'languageRepository',
		new UlsLanguageRepository(
			contentLanguages,
			mwWindow.$.uls.data,
		),
	);

	services.set(
		'messagesRepository',
		new MessagesRepository(
			mwWindow.mw.message,
			Object.values( MessageKey ),
		),
	);

	services.set(
		'entityRepository',
		new EntityRepository(
			mwWindow.mw.hook( Hooks.entityLoaded ),
			entityInitializer,
		),
	);

	services.set(
		'entityEditabilityResolver',
		{
			isEditable() {
				return Promise.resolve(
					mwWindow.mw.config.get( 'wbIsEditView' )
					&& mwWindow.mw.config.get( 'wgRelevantPageIsProbablyEditable' ),
				);
			},
		},
	);

	const repoConfig = mwWindow.mw.config.get( 'wbRepo' );
	const baseUrl = repoConfig.scriptPath;
	const userName = mwWindow.mw.config.get( 'wgUserName' );
	const axios = axiosFactory( baseUrl, userName );

	services.set(
		'writingEntityRepository',
		new AxiosWritingEntityRepository( axios, entityInitializer, termboxConfig.tags ),
	);

	services.set(
		'userPreferenceRepository',
		new DispatchingUserPreferenceRepository( {
			[ UserPreference.HIDE_ANON_EDIT_WARNING ]: new CookieUserPreferenceRepository<boolean>(
				new BooleanCookieStore( new StringMWCookieStore( mwWindow.mw.cookie ) ),
				'wikibase-no-anonymouseditwarning',
				{ maxAge: 60 * 60 * 24 * 365 * 10 },
			),
			[ UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION ]: new DelegatingUserPreferenceRepository(
				new CompoundUserPreferenceRepository(
					new MWUserOptionsReadingSingleUserPreferenceRepository(
						'wb-acknowledgedcopyrightversion',
						mwWindow.mw.user.options,
					),
					new AxiosWritingSingleUserPreferenceRepository(
						'wb-acknowledgedcopyrightversion',
						axios,
					),
				),
				new CookieUserPreferenceRepository<string | null>(
					new StringMWCookieStore( mwWindow.mw.cookie ),
					'wikibase.acknowledgedcopyrightversion',
					{ maxAge: 60 * 60 * 24 * 365 * 10 },
				),
				userName !== null,
			),

		} ),
	);

	return { config, services };
}
