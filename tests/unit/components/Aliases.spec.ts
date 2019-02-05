import { shallowMount } from '@vue/test-utils';
import Aliases from '@/components/Aliases.vue';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import { NS_ENTITY, NS_MESSAGES, NS_USER } from '@/store/namespaces';
import Term from '@/datamodel/Term';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import Language from '@/datamodel/Language';
import { MessageKeys } from '@/common/MessageKeys';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';

function stringListToTermListMap( values: { [ language: string ]: string[] } ) {
	const aliases: { [ language: string ]: Term[] } = {};

	Object.entries( values ).forEach( ( [ language, aliasValues ] ) =>  {
		aliases[ language ] = aliasValues.map( ( value ) => ( { language, value } ) );
	} );

	return aliases;
}

function newEntityWithAliases( aliases: { [ language: string ]: string[] } ) {
	return new FingerprintableEntity( 'Q123', {}, {}, stringListToTermListMap( aliases ) );
}

const ALIASES_SELECTOR = '.wikibase-termbox-fingerprint__aliases';
const ALIAS_SELECTOR = '.wikibase-termbox-fingerprint__alias';

describe( 'Aliases', () => {

	it( 'shows the entity aliases in the given language', () => {
		const language = 'en';
		const aliases = [ 'hello', 'hullo' ];

		const store = createStore();
		store.commit( mutation( NS_ENTITY, ENTITY_INIT ), newEntityWithAliases( {
			[ language ]: aliases,
		} ) );

		const wrapper = shallowMount( Aliases, {
			propsData: { language: { code: language, directionality: 'ltr' } },
			store,
		} );

		const $aliases = wrapper.find( ALIASES_SELECTOR ).findAll( ALIAS_SELECTOR );
		expect( $aliases.at( 0 ).text() ).toBe( aliases[0] );
	} );

	it( 'shows aliases with a separator', () => {
		const language = 'en';
		const separator = '|';

		const store = createStore();
		store.commit( mutation( NS_ENTITY, ENTITY_INIT ), newEntityWithAliases( {
			[ language ]: [ 'hello' ],
		} ) );

		store.commit( mutation( NS_USER, LANGUAGE_INIT ), language );
		store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
			[ language ]: { [ MessageKeys.ALIAS_SEPARATOR ]: separator },
		} );

		const wrapper = shallowMount( Aliases, {
			propsData: { language: { code: language, directionality: 'ltr' } },
			store,
		} );

		expect( wrapper.find( ALIAS_SELECTOR ).attributes( 'data-separator' ) ).toBe( separator );
	} );

	it( 'renders an empty element if there are no aliases', () => {
		const store = createStore();

		const wrapper = shallowMount( Aliases, {
			propsData: { language: { code: 'en', directionality: 'ltr' } },
			store,
		} );

		expect( wrapper.find( '.wikibase-termbox-fingerprint__aliases--placeholder' ).isEmpty() ).toBeTruthy();
	} );

	it.each( [
		[ { code: 'en', directionality: 'ltr' } ],
		[ { code: 'ar', directionality: 'rtl' } ],
	] )( 'sets dir and lang attributes for %o', ( language: Language ) => {
		const store = createStore();
		store.commit( mutation( NS_ENTITY, ENTITY_INIT ), newEntityWithAliases( {
			[ language.code ]: [ 'whatevs' ],
		} ) );

		const $aliases = shallowMount( Aliases, { propsData: { language }, store } ).find( ALIASES_SELECTOR );

		expect( $aliases.attributes( 'lang' ) ).toBe( language.code );
		expect( $aliases.attributes( 'dir' ) ).toBe( language.directionality );
	} );

} );
