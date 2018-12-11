import Vue from 'vue';
import init from '@/client/init';
import buildApp from '@/common/buildApp';
import TermboxRequest from '@/common/TermboxRequest';
import { factory } from '@/common/TermboxFactory';
import UlsLanguageTranslationRepository from '@/client/data-access/UlsLanguageTranslationRepository';
import UlsLanguageRepository from '@/client/data-access/UlsLanguageRepository';
import EntityRepository from '@/client/data-access/EntityRepository';
import MwWindow from '@/client/mediawiki/MwWindow';
import { Hooks } from '@/client/mediawiki/Hooks';

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

factory.setEntityRepository( new EntityRepository(
	( window as MwWindow ).mw.hook( Hooks.entityLoaded ),
) );

init().then( ( termboxRequest: TermboxRequest ) => {
	buildApp( termboxRequest ).then( ( app ) => {
		app.$mount( '.wikibase-entitytermsview' );
	} );
} );
