import { shallowMount } from '@vue/test-utils';
import Aliases from '@/components/Aliases.vue';
import { createStore } from '@/store';
import { mutation } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { MessageKey } from '@/common/MessageKey';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import mockMessageMixin from '../store/mockMessageMixin';
import emptyServices from '../emptyServices';

function createStoreWithLanguage( language: Language ) {
	const store = createStore( emptyServices as any );
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
			props: { aliases },
			global: { plugins: [ store ] },
		} );

		const $aliases = wrapper.find( ALIASES_SELECTOR ).findAll( ALIAS_SELECTOR );
		expect( $aliases[ 0 ].text() ).toBe( aliases[ 0 ].value );
		expect( $aliases[ 1 ].text() ).toBe( aliases[ 1 ].value );
	} );

	it( 'shows aliases with a separator', () => {
		const language = 'en';
		const separator = '|';

		const wrapper = shallowMount( Aliases, {
			props: {
				aliases: [
					{ language, value: 'hello' },
					{ language, value: 'hello2' },
				],
			},
			mixins: [ mockMessageMixin( { [ MessageKey.ALIAS_SEPARATOR ]: separator } ) ],
			global: {
				plugins: [ createStoreWithLanguage( { code: language, directionality: 'ltr' } ) ],
			},
		} );

		expect( wrapper.find( ALIAS_SELECTOR ).attributes( 'data-separator' ) ).toBe( separator );
	} );

	it( 'renders an empty element if there are no aliases', () => {
		const store = createStore( emptyServices as any );

		const wrapper = shallowMount( Aliases, {
			props: { aliases: [] },
			global: { plugins: [ store ] },
		} );

		expect( wrapper.find( '.wb-ui-aliases--placeholder' ).element.children ).toHaveLength( 0 );
	} );

	it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
		const languageCode = 'en';
		const language = { code: 'en', directionality: 'ltr' };
		const inlanguage = jest.fn();
		const store = createStoreWithLanguage( language );

		shallowMount( Aliases, {
			props: { aliases: [ { language: languageCode, value: 'hello' } ] },
			global: {
				plugins: [ store ],
				directives: {
					inlanguage,
				},
			},
		} );

		expect( inlanguage ).toHaveBeenCalledTimes( 1 );
		expect( inlanguage.mock.calls[ 0 ][ 1 ].value ).toBe( languageCode );
	} );

} );
