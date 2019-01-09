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

Vue.config.productionTip = false;
const contentLanguages = new ( window as MwWindow ).wb.WikibaseContentLanguages();

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
			( window as MwWindow ).mw.config.get( 'wgIsProbablyEditable' ),
		);
	},
} );

init().then( ( termboxRequest: TermboxRequest ) => {
	buildApp( termboxRequest ).then( ( app ) => {
		app.$mount( '.wikibase-entitytermsview' );
	} );
} );
