import DescriptionEdit from '@/components/DescriptionEdit.vue';
import { ResizingTextField } from '@wmde/wikibase-vuejs-components';
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

	it( 'shows the description in the given language', () => {
		const language = 'en';
		const description = 'hello';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

		const wrapper = shallowMount( DescriptionEdit, {
			propsData: {
				description: { language, value: description },
				languageCode: language,
			},
			store,
		} );

		const textField = wrapper.find( ResizingTextField );
		expect( textField.props( 'value' ) ).toBe( description );

	} );

	it( 'emits input event when the description is edited', () => {
		const language = 'en';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );
		store.dispatch = jest.fn();
		const wrapper = shallowMount( DescriptionEdit, {
			propsData: {
				description: { language, value: 'a description' },
				languageCode: language,
			},
			store,
		} );
		const newDescription = 'a new description';
		wrapper.find( ResizingTextField ).vm.$emit( 'input', newDescription );

		expect( wrapper.emitted( 'input' ) ).toHaveLength( 1 );
		expect( wrapper.emitted( 'input' )[ 0 ][ 0 ] ).toEqual( { language, value: newDescription } );
	} );

	it( 'passes a placeholder down', () => {
		const placeholderMessage = 'placeholder';
		const wrapper = shallowMount( DescriptionEdit, {
			store: createStoreWithLanguage( { code: 'en', directionality: 'ltr' } ),
			propsData: {
				description: null,
				languageCode: 'en',
			},
			mixins: [
				mockMessageMixin( { [ MessageKey.PLACEHOLDER_EDIT_DESCRIPTION ]: placeholderMessage } ),
			],
		} );

		expect( wrapper.find( ResizingTextField ).attributes( 'placeholder' ) ).toBe( placeholderMessage );
	} );

	it( 'passes a maxlength down', () => {
		const maxLength = 23;
		const wrapper = shallowMount( DescriptionEdit, {
			store: createStoreWithLanguage( { code: 'en', directionality: 'ltr' } ),
			propsData: {
				description: null,
				languageCode: 'en',
			},
			mixins: [
				newConfigMixin( {
					textFieldCharacterLimit: maxLength,
				} as ConfigOptions ) ],
		} );

		expect( wrapper.find( ResizingTextField ).attributes( 'maxlength' ) ).toBe( maxLength.toString() );
	} );

	describe( 'directionality and language code', () => {

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const languageCode = 'en';
			const language = { code: languageCode, directionality: 'ltr' };
			const inlanguage = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( DescriptionEdit, {
				propsData: {
					description: { language: languageCode, value: 'meep' },
					languageCode,
				},
				store,
				directives: {
					inlanguage,
				},
			} );

			expect( inlanguage ).toHaveBeenCalledTimes( 1 );
			expect( inlanguage.mock.calls[ 0 ][ 1 ].value ).toBe( languageCode );
		} );

	} );

} );
