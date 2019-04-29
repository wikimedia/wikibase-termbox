import Description from '@/components/Description.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_LANGUAGE } from '@/store/namespaces';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { MessageKeys } from '@/common/MessageKeys';
import Language from '@/datamodel/Language';
import mockMessageMixin from '../store/mockMessageMixin';

const DESCRIPTION_SELECTOR = '.wb-ui-description';

function createStoreWithLanguage( language: Language ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ language.code ]: language,
	} );
	return store;
}

describe( 'Description', () => {

	it( 'shows the entity description in the given language', () => {
		const language = 'en';
		const description = 'hello';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

		const wrapper = shallowMount( Description, {
			propsData: { description: { language, value: description } },
			store,
		} );

		expect( wrapper.find( DESCRIPTION_SELECTOR ).text() ).toBe( description );
	} );

	it( 'shows a missing description indicator', () => {
		const missingDescriptionMessage = 'description missing';
		const wrapper = shallowMount( Description, {
			propsData: { description: null },
			mixins: [ mockMessageMixin( { [ MessageKeys.MISSING_DESCRIPTION ]: missingDescriptionMessage } ) ],
		} );

		expect( wrapper.find( DESCRIPTION_SELECTOR ).text() ).toBe( missingDescriptionMessage );
	} );

	describe( 'directionality and language code', () => {

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const language = { code: 'ar', directionality: 'rtl' };
			const inlanguageDirective = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( Description, {
				propsData: { description: { language: language.code, value: 'bla' } },
				store,
				directives: {
					inlanguage: inlanguageDirective,
				},
			} );

			expect( inlanguageDirective ).toBeCalledTimes( 1 );
			expect( inlanguageDirective.mock.calls[ 0 ][ 1 ].value ).toBe( language );
		} );

		it( 'does not add directionality markup for missing description', () => {
			const inlanguageDirective = jest.fn();
			const store = createStore();

			shallowMount( Description, {
				propsData: { description: null },
				store,
				directives: {
					inlanguage: inlanguageDirective,
				},
			} );

			expect( inlanguageDirective ).not.toBeCalled();
		} );

	} );

} );
