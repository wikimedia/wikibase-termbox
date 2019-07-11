import DescriptionEdit from '@/components/DescriptionEdit.vue';
import TermTextField from '@/components/TermTextField.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { ENTITY_DESCRIPTION_EDIT } from '@/store/entity/actionTypes';
import { action } from '@/store/util';
import { NS_ENTITY } from '@/store/namespaces';
import { MessageKey } from '@/common/MessageKey';
import mockMessageMixin from '../store/mockMessageMixin';
import newConfigMixin, { ConfigOptions } from '@/components/mixins/newConfigMixin';

function createStoreWithLanguage( language: Language ) {
	const store = createStore();
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

		const textField = wrapper.find( TermTextField );
		expect( textField.props( 'value' ) ).toBe( description );

	} );

	it( `triggers ${ENTITY_DESCRIPTION_EDIT} when the description is edited`, () => {
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
		wrapper.find( TermTextField ).vm.$emit( 'input', newDescription );

		expect( store.dispatch ).toHaveBeenCalledWith(
			action( NS_ENTITY, ENTITY_DESCRIPTION_EDIT ),
			{ language, value: newDescription },
		);
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

		expect( wrapper.find( TermTextField ).attributes( 'placeholder' ) ).toBe( placeholderMessage );
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

		expect( wrapper.find( TermTextField ).attributes( 'maxlength' ) ).toBe( maxLength.toString() );
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
