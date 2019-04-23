import Vue from 'vue';
import init from '@/client/init';
import buildApp from '@/common/buildApp';
import TermboxRequest from '@/common/TermboxRequest';
import { factory } from '@/common/TermboxFactory';
import UlsLanguageTranslationRepository from '@/client/data-access/UlsLanguageTranslationRepository';
import UlsLanguageRepository from '@/client/data-access/UlsLanguageRepository';
import MessagesRepository from '@/client/data-access/MessagesRepository';
import EntityRepository from '@/client/data-access/EntityRepository';
import MwWindow from '@/client/mediawiki/MwWindow';
import { Hooks } from '@/client/mediawiki/Hooks';
import { MessageKeys } from '@/common/MessageKeys';
import inlanguage from '@/client/directives/inlanguage';
import AxiosWritingEntityRepository from '@/client/data-access/AxiosWritingEntityRepository';
import EntityInitializer from '@/common/EntityInitializer';
import { getAxios } from '@/client/axios/axiosFactory';

Vue.config.productionTip = false;
const contentLanguages = new ( window as MwWindow ).wb.WikibaseContentLanguages();

Vue.directive( 'inlanguage', inlanguage );

factory.setLanguageTranslationRepository(
	new UlsLanguageTranslationRepository(
		contentLanguages,
	),
);

factory.setLanguageRepository(
	new UlsLanguageRepository(
		contentLanguages,
		( window as MwWindow ).$.uls.data,
	),
);

factory.setMessagesRepository(
	new MessagesRepository(
		( window as MwWindow ).mw.message,
		Object.values( MessageKeys ),
	),
);

factory.setEntityRepository( new EntityRepository(
	( window as MwWindow ).mw.hook( Hooks.entityLoaded ),
) );

factory.setEntityEditabilityResolver( {
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

factory.setWritingEntityRepository( new AxiosWritingEntityRepository( axios, new EntityInitializer() ) );

init().then( ( termboxRequest: TermboxRequest ) => {
	buildApp( termboxRequest ).then( ( app ) => {
		app.$mount( '.wikibase-entitytermsview' );
	} );
} );
