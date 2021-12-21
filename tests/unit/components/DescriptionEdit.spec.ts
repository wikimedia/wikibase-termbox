import DescriptionEdit from '@/components/DescriptionEdit.vue';
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

describe( 'DescriptionEdit', () => {

	// default mixins for tests that need nothing more specific
	const messages = mockMessageMixin();
	const config = newConfigMixin( {} as ConfigOptions );
	const mixins = [ messages, config ];

	it( 'shows the description in the given language', () => {
		const language = 'en';
		const description = 'hello';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

		const wrapper = shallowMount( DescriptionEdit, {
			props: {
				description: { language, value: description },
				languageCode: language,
			},
			global: { plugins: [ store ] },
			mixins,
		} );

		const textField = wrapper.findComponent( ResizingTextField );
		expect( textField.props( 'value' ) ).toBe( description );

	} );

	it( 'emits input event when the description is edited', () => {
		const language = 'en';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );
		store.dispatch = jest.fn();
		const wrapper = shallowMount( DescriptionEdit, {
			props: {
				description: { language, value: 'a description' },
				languageCode: language,
			},
			global: { plugins: [ store ] },
			mixins,
		} );
		const newDescription = 'a new description';
		wrapper.findComponent( ResizingTextField ).vm.$emit( 'input', newDescription );

		expect( wrapper.emitted( 'input' ) ).toHaveLength( 1 );
		expect( wrapper.emitted( 'input' )![ 0 ][ 0 ] ).toEqual( { language, value: newDescription } );
	} );

	it( 'passes a placeholder down', () => {
		const placeholderMessage = 'placeholder';
		const wrapper = shallowMount( DescriptionEdit, {
			global: { plugins: [ createStoreWithLanguage( { code: 'en', directionality: 'ltr' } ) ] },
			props: {
				description: null,
				languageCode: 'en',
			},
			mixins: [
				mockMessageMixin( { [ MessageKey.PLACEHOLDER_EDIT_DESCRIPTION ]: placeholderMessage } ),
				config,
			],
		} );

		expect( wrapper.findComponent( ResizingTextField ).attributes( 'placeholder' ) ).toBe( placeholderMessage );
	} );

	it( 'passes a maxlength down', () => {
		const maxLength = 23;
		const wrapper = shallowMount( DescriptionEdit, {
			global: { plugins: [ createStoreWithLanguage( { code: 'en', directionality: 'ltr' } ) ] },
			props: {
				description: null,
				languageCode: 'en',
			},
			mixins: [
				newConfigMixin( {
					textFieldCharacterLimit: maxLength,
				} as ConfigOptions ),
				messages,
			],
		} );

		expect( wrapper.findComponent( ResizingTextField ).attributes( 'maxlength' ) ).toBe( maxLength.toString() );
	} );

	describe( 'directionality and language code', () => {

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const languageCode = 'en';
			const language = { code: languageCode, directionality: 'ltr' };
			const inlanguage = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( DescriptionEdit, {
				props: {
					description: { language: languageCode, value: 'meep' },
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
