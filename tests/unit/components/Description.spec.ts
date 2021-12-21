import Description from '@/components/Description.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_LANGUAGE } from '@/store/namespaces';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { MessageKey } from '@/common/MessageKey';
import Language from '@/datamodel/Language';
import mockMessageMixin from '../store/mockMessageMixin';
import emptyServices from '../emptyServices';

const DESCRIPTION_SELECTOR = '.wb-ui-description';

function createStoreWithLanguage( language: Language ) {
	const store = createStore( emptyServices as any );
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
			props: { description: { language, value: description } },
			global: { plugins: [ store ] },
		} );

		expect( wrapper.find( DESCRIPTION_SELECTOR ).text() ).toBe( description );
	} );

	it( 'shows a missing description indicator', () => {
		const missingDescriptionMessage = 'description missing';
		const wrapper = shallowMount( Description, {
			props: { description: null },
			mixins: [ mockMessageMixin( { [ MessageKey.MISSING_DESCRIPTION ]: missingDescriptionMessage } ) ],
		} );

		expect( wrapper.find( DESCRIPTION_SELECTOR ).text() ).toBe( missingDescriptionMessage );
	} );

	describe( 'directionality and language code', () => {

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const languageCode = 'ar';
			const language = { code: languageCode, directionality: 'rtl' };
			const inlanguage = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( Description, {
				props: { description: { language: languageCode, value: 'bla' } },
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

		it( 'does not add directionality markup for missing description', () => {
			const inlanguageDirective = jest.fn();
			const store = createStore( emptyServices as any );

			shallowMount( Description, {
				props: { description: null },
				global: {
					plugins: [ store ],
					directives: {
						inlanguage: inlanguageDirective,
					},
				},
			} );

			expect( inlanguageDirective ).not.toBeCalled();
		} );

	} );

} );
