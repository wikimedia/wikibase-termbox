import Label from '@/components/Label.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_LANGUAGE } from '@/store/namespaces';
import { MessageKey } from '@/common/MessageKey';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import mockMessageMixin from '../store/mockMessageMixin';
import emptyServices from '../emptyServices';

const LABEL_SELECTOR = '.wb-ui-label';

function createStoreWithLanguage( language: Language ) {
	const store = createStore( emptyServices as any );
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
			props: {
				label: { language, value: label },
			},
			global: { plugins: [ store ] },
		} );

		expect( wrapper.find( LABEL_SELECTOR ).text() ).toBe( label );
	} );

	it( 'shows a missing label indicator', () => {
		const missingLabelMessage = 'label missing';
		const wrapper = shallowMount( Label, {
			props: { label: null },
			mixins: [ mockMessageMixin( { [ MessageKey.MISSING_LABEL ]: missingLabelMessage } ) ],
		} );

		expect( wrapper.find( LABEL_SELECTOR ).text() ).toBe( missingLabelMessage );
	} );

	describe( 'directionality and language code', () => {

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const languageCode = 'en';
			const inlanguage = jest.fn();

			shallowMount( Label, {
				props: {
					label: { language: languageCode, value: 'meep' },
				},
				global: {
					directives: {
						inlanguage,
					},
				},
			} );

			expect( inlanguage ).toHaveBeenCalledTimes( 1 );
			expect( inlanguage.mock.calls[ 0 ][ 1 ].value ).toBe( languageCode );
		} );

		it( 'does not add language markup for missing labels', () => {
			const inlanguageDirective = jest.fn();
			const store = createStore( emptyServices as any );

			shallowMount( Label, {
				props: { label: null },
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

	it( 'renders the label as a heading if it is the primary language', () => {
		const store = createStoreWithLanguage( { code: 'en', directionality: 'ltr' } );
		const wrapper = shallowMount( Label, {
			props: {
				isPrimary: true,
				label: { language: 'en', value: 'meep' },
			},
			global: { plugins: [ store ] },
		} );
		expect( wrapper.find( LABEL_SELECTOR ).element.tagName ).toBe( 'H2' );
	} );

} );
