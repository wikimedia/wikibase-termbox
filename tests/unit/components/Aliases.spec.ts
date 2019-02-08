import { shallowMount } from '@vue/test-utils';
import Aliases from '@/components/Aliases.vue';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_LANGUAGE, NS_MESSAGES, NS_USER } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { MessageKeys } from '@/common/MessageKeys';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';

function createStoreWithLanguage( language: Language ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ language.code ]: language,
	} );
	return store;
}

const ALIASES_SELECTOR = '.wb-ui-aliases';
const ALIAS_SELECTOR = '.wb-ui-aliases__alias';

describe( 'Aliases', () => {

	it( 'shows the entity aliases in the given language', () => {
		const language = 'en';
		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

		const aliases = [
			{ language, value: 'hello' },
			{ language, value: 'hello2' },
		];
		const wrapper = shallowMount( Aliases, {
			propsData: { aliases },
			store,
		} );

		const $aliases = wrapper.find( ALIASES_SELECTOR ).findAll( ALIAS_SELECTOR );
		expect( $aliases.at( 0 ).text() ).toBe( aliases[ 0 ].value );
		expect( $aliases.at( 1 ).text() ).toBe( aliases[ 1 ].value );
	} );

	it( 'shows aliases with a separator', () => {
		const language = 'en';
		const separator = '|';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

		store.commit( mutation( NS_USER, LANGUAGE_INIT ), language );
		store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
			[ language ]: { [ MessageKeys.ALIAS_SEPARATOR ]: separator },
		} );

		const wrapper = shallowMount( Aliases, {
			propsData: {
				aliases: [
					{ language, value: 'hello' },
					{ language, value: 'hello2' },
				],
			},
			store,
		} );

		expect( wrapper.find( ALIAS_SELECTOR ).attributes( 'data-separator' ) ).toBe( separator );
	} );

	it( 'renders an empty element if there are no aliases', () => {
		const store = createStore();

		const wrapper = shallowMount( Aliases, {
			propsData: { aliases: [] },
			store,
		} );

		expect( wrapper.find( '.wb-ui-aliases--placeholder' ).isEmpty() ).toBeTruthy();
	} );

	it.each( [
		[ { code: 'en', directionality: 'ltr' } ],
		[ { code: 'ar', directionality: 'rtl' } ],
	] )( 'sets dir and lang attributes for %o', ( language: Language ) => {
		const store = createStoreWithLanguage( language );

		const $aliases = shallowMount( Aliases, {
			propsData: { aliases: [ { language: language.code, value: 'hello' } ] },
			store,
		} ).find( ALIASES_SELECTOR );

		expect( $aliases.attributes( 'lang' ) ).toBe( language.code );
		expect( $aliases.attributes( 'dir' ) ).toBe( language.directionality );
	} );

} );
