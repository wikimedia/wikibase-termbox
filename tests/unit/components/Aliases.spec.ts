import { shallowMount } from '@vue/test-utils';
import Aliases from '@/components/Aliases.vue';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { MessageKey } from '@/common/MessageKey';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import mockMessageMixin from '../store/mockMessageMixin';

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

		const wrapper = shallowMount( Aliases, {
			propsData: {
				aliases: [
					{ language, value: 'hello' },
					{ language, value: 'hello2' },
				],
			},
			store: createStoreWithLanguage( { code: language, directionality: 'ltr' } ),
			mixins: [ mockMessageMixin( { [ MessageKey.ALIAS_SEPARATOR ]: separator } ) ],
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

	it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
		const languageCode = 'en';
		const language = { code: 'en', directionality: 'ltr' };
		const inlanguage = jest.fn();
		const store = createStoreWithLanguage( language );

		shallowMount( Aliases, {
			propsData: { aliases: [ { language: languageCode, value: 'hello' } ] },
			store,
			directives: {
				inlanguage,
			},
		} );

		expect( inlanguage ).toHaveBeenCalledTimes( 1 );
		expect( inlanguage.mock.calls[ 0 ][ 1 ].value ).toBe( languageCode );
	} );

} );
