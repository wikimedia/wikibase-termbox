import Vue from 'vue';
import init from '@/client/init';
import buildApp from '@/common/buildApp';
import TermboxRequest from '@/common/TermboxRequest';
import { factory } from '@/common/TermboxFactory';
import UlsLanguageTranslationRepository from '@/client/data-access/UlsLanguageTranslationRepository';
import EntityRepository from '@/client/data-access/EntityRepository';
import MwWindow from '@/client/mediawiki/MwWindow';
import { Hooks } from '@/client/mediawiki/Hooks';

Vue.config.productionTip = false;

factory.setLanguageTranslationRepository(
	new UlsLanguageTranslationRepository( ( window as MwWindow ).wb.getLanguageNameByCode ),
);
factory.setEntityRepository( new EntityRepository(
	( window as MwWindow ).mw.hook( Hooks.entityLoaded ),
) );

init().then( ( termboxRequest: TermboxRequest ) => {
	buildApp( termboxRequest ).then( ( app ) => {
		app.$mount( '.wikibase-entitytermsview' );
	} );
} );
