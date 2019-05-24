import Vue from 'vue';
import init from '@/client/init';
import buildApp from '@/common/buildApp';
import TermboxRequest from '@/common/TermboxRequest';
import { services } from '@/common/TermboxServices';
import UlsLanguageTranslationRepository from '@/client/data-access/UlsLanguageTranslationRepository';
import UlsLanguageRepository from '@/client/data-access/UlsLanguageRepository';
import MessagesRepository from '@/client/data-access/MessagesRepository';
import EntityRepository from '@/client/data-access/EntityRepository';
import MwWindow from '@/client/mediawiki/MwWindow';
import { Hooks } from '@/client/mediawiki/Hooks';
import { MessageKeys } from '@/common/MessageKeys';
import inlanguage from '@/client/directives/inlanguage';
import focus from '@/client/directives/focus';
import AxiosWritingEntityRepository from '@/client/data-access/AxiosWritingEntityRepository';
import EntityInitializer from '@/common/EntityInitializer';
import { getAxios } from '@/client/axios/axiosFactory';
import newConfigMixin from '@/components/mixins/newConfigMixin';

Vue.config.productionTip = false;
Vue.mixin( newConfigMixin(
	{
		textFieldCharacterLimit: ( window as MwWindow ).mw.config.get( 'wbMultiLingualStringLimit' ),
	},
) );

Vue.directive( 'inlanguage', inlanguage );
Vue.directive( 'focus', { inserted: focus } );

const contentLanguages = new ( window as MwWindow ).wb.WikibaseContentLanguages();

services.setLanguageTranslationRepository(
	new UlsLanguageTranslationRepository(
		contentLanguages,
	),
);

services.setLanguageRepository(
	new UlsLanguageRepository(
		contentLanguages,
		( window as MwWindow ).$.uls.data,
	),
);

services.setMessagesRepository(
	new MessagesRepository(
		( window as MwWindow ).mw.message,
		Object.values( MessageKeys ),
	),
);

services.setEntityRepository( new EntityRepository(
	( window as MwWindow ).mw.hook( Hooks.entityLoaded ),
) );

services.setEntityEditabilityResolver( {
	isEditable() {
		return Promise.resolve(
			( window as MwWindow ).mw.config.get( 'wbIsEditView' )
				&& ( window as MwWindow ).mw.config.get( 'wgRelevantPageIsProbablyEditable' ),
		);
	},
} );

const repoConfig = ( window as MwWindow ).mw.config.get( 'wbRepo' );
const baseUrl = repoConfig.scriptPath;
const userName = ( window as MwWindow ).mw.config.get( 'wgUserName' );
const axios = getAxios( baseUrl, userName );

services.setWritingEntityRepository( new AxiosWritingEntityRepository( axios, new EntityInitializer() ) );

init().then( ( termboxRequest: TermboxRequest ) => {
	buildApp( termboxRequest ).then( ( app ) => {
		app.$mount( '.wikibase-entitytermsview' );
	} );
} );
