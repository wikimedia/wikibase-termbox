import Label from '@/components/Label.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_MESSAGES, NS_USER, NS_LANGUAGE } from '@/store/namespaces';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { MessageKeys } from '@/common/MessageKeys';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';

const LABEL_SELECTOR = '.wb-ui-label';

function createStoreWithLanguage( language: Language ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ language.code ]: language,
	} );
	return store;
}

describe( 'Label', () => {

	it( 'shows the entity label in the given language', () => {
		const language = 'en';
		const label = 'hello';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

		const wrapper = shallowMount( Label, {
			propsData: {
				label: { language, value: label },
			},
			store,
		} );

		expect( wrapper.find( LABEL_SELECTOR ).text() ).toBe( label );
	} );

	it( 'shows a missing label indicator', () => {
		const language = 'en';
		const missingLabelMessage = 'label missing';
		const store = createStore();
		store.commit( mutation( NS_USER, LANGUAGE_INIT ), language );
		store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
			[ language ]: { [ MessageKeys.MISSING_LABEL ]: missingLabelMessage },
		} );

		const wrapper = shallowMount( Label, {
			propsData: { label: null },
			store,
		} );

		expect( wrapper.find( LABEL_SELECTOR ).text() ).toBe( missingLabelMessage );
	} );

	describe( 'directionality and language code', () => {

		it.each( [
			[ { code: 'en', directionality: 'ltr' } ],
			[ { code: 'ar', directionality: 'rtl' } ],
		] )( 'sets dir and lang attributes for %o', ( language: Language ) => {
			const store = createStoreWithLanguage( language );

			const $label = shallowMount( Label, {
				propsData: {
					label: { language: language.code, value: 'meow' },
				},
				store,
			} ).find( LABEL_SELECTOR );

			expect( $label.attributes( 'lang' ) ).toBe( language.code );
			expect( $label.attributes( 'dir' ) ).toBe( language.directionality );
		} );

		it( 'does not add directionality markup for missing labels', () => {
			const store = createStore();

			const wrapper = shallowMount( Label, {
				propsData: { label: null },
				store,
			} );

			expect( wrapper.find( LABEL_SELECTOR ).attributes( 'lang' ) ).toBeFalsy();
			expect( wrapper.find( LABEL_SELECTOR ).attributes( 'dir' ) ).toBeFalsy();
		} );

	} );

	it( 'renders the label as a heading if it is the primary language', () => {
		const store = createStoreWithLanguage( { code: 'en', directionality: 'ltr' } );
		const wrapper = shallowMount( Label, {
			propsData: {
				isPrimary: true,
				label: { language: 'en', value: 'meep' },
			},
			store,
		} );
		expect( wrapper.find( LABEL_SELECTOR ).element.tagName ).toBe( 'H2' );
	} );

} );
