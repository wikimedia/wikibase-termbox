import LabelEdit from '@/components/LabelEdit.vue';
import ResizingTextField from '@/components/ResizingTextField.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { MessageKey } from '@/common/MessageKey';
import mockMessageMixin from '../store/mockMessageMixin';
import newConfigMixin, { ConfigOptions } from '@/components/mixins/newConfigMixin';
import emptyServices from '../emptyServices';

function createStoreWithLanguage( language: Language ) {
	const store = createStore( emptyServices as any );
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ language.code ]: language,
	} );
	return store;
}

describe( 'LabelEdit', () => {

	// default mixins for tests that need nothing more specific
	const messages = mockMessageMixin();
	const config = newConfigMixin( {} as ConfigOptions );
	const mixins = [ messages, config ];

	it( 'shows the label in the given language', () => {
		const language = 'en';
		const label = 'hello';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

		const wrapper = shallowMount( LabelEdit, {
			props: {
				label: { language, value: label },
				languageCode: language,
			},
			global: { plugins: [ store ] },
			mixins,
		} );

		expect( wrapper.findComponent( ResizingTextField ).props( 'value' ) ).toBe( label );
	} );

	it( 'emits input event when the label is edited', () => {
		const language = 'en';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );
		store.dispatch = jest.fn();
		const wrapper = shallowMount( LabelEdit, {
			props: {
				label: { language, value: 'hi' },
				languageCode: language,
			},
			global: { plugins: [ store ] },
			mixins,
		} );
		const newLabel = 'hello';
		wrapper.findComponent( ResizingTextField ).vm.$emit( 'input', newLabel );
		expect( wrapper.emitted( 'input' ) ).toHaveLength( 1 );
		expect( wrapper.emitted( 'input' )![ 0 ][ 0 ] ).toEqual( { language, value: newLabel } );

	} );

	it( 'has an isPrimary prop', () => {
		const wrapper = shallowMount( LabelEdit, {
			global: { plugins: [ createStoreWithLanguage( { code: 'en', directionality: 'ltr' } ) ] },
			props: {
				label: null,
				languageCode: 'en',
				isPrimary: true,
			},
			mixins,
		} );

		expect( wrapper.props() ).toHaveProperty( 'isPrimary', true );
		expect( wrapper.classes() ).toContain( 'wb-ui-label-edit--primary' );
	} );

	it( 'passes a placeholder down', () => {
		const placeholderMessage = 'placeholder';
		const wrapper = shallowMount( LabelEdit, {
			props: {
				label: null,
				languageCode: 'en',
			},
			mixins: [
				mockMessageMixin( { [ MessageKey.PLACEHOLDER_EDIT_LABEL ]: placeholderMessage } ),
				config,
			],
			global: {
				plugins: [ createStoreWithLanguage( { code: 'en', directionality: 'ltr' } ) ],
			},
		} );

		expect( wrapper.findComponent( ResizingTextField ).attributes( 'placeholder' ) ).toBe( placeholderMessage );
	} );

	it( 'passes a maxlength down', () => {
		const maxLength = 23;
		const wrapper = shallowMount( LabelEdit, {
			props: {
				label: null,
				languageCode: 'en',
			},
			mixins: [
				newConfigMixin( {
					textFieldCharacterLimit: maxLength,
				} as ConfigOptions ),
				messages,
			],
			global: {
				plugins: [ createStoreWithLanguage( { code: 'en', directionality: 'ltr' } ) ],
			},
		} );

		expect( wrapper.findComponent( ResizingTextField ).attributes( 'maxlength' ) ).toBe( maxLength.toString() );
	} );

	describe( 'directionality and language code', () => {

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const languageCode = 'en';
			const language = { code: languageCode, directionality: 'ltr' };
			const inlanguage = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( LabelEdit, {
				props: {
					label: { language: languageCode, value: 'meep' },
					languageCode,
				},
				global: {
					plugins: [ store ],
					directives: {
						inlanguage,
					},
				},
				mixins,
			} );

			expect( inlanguage ).toHaveBeenCalledTimes( 1 );
			expect( inlanguage.mock.calls[ 0 ][ 1 ].value ).toBe( languageCode );
		} );

	} );

} );
