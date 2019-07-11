import LabelEdit from '@/components/LabelEdit.vue';
import TermTextField from '@/components/TermTextField.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { action, mutation } from '@/store/util';
import { NS_ENTITY, NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { ENTITY_LABEL_EDIT } from '@/store/entity/actionTypes';
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

describe( 'LabelEdit', () => {

	it( 'shows the label in the given language', () => {
		const language = 'en';
		const label = 'hello';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

		const wrapper = shallowMount( LabelEdit, {
			propsData: {
				label: { language, value: label },
				languageCode: language,
			},
			store,
		} );

		expect( wrapper.find( TermTextField ).props( 'value' ) ).toBe( label );
	} );

	it( `triggers ${ENTITY_LABEL_EDIT} when the label is edited`, () => {
		const language = 'en';

		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );
		store.dispatch = jest.fn();
		const wrapper = shallowMount( LabelEdit, {
			propsData: {
				label: { language, value: 'hi' },
				languageCode: language,
			},
			store,
		} );
		const newLabel = 'hello';
		wrapper.find( TermTextField ).vm.$emit( 'input', newLabel );

		expect( store.dispatch ).toHaveBeenCalledWith(
			action( NS_ENTITY, ENTITY_LABEL_EDIT ),
			{ language, value: newLabel },
		);
	} );

	it( 'has an isPrimary prop', () => {
		const wrapper = shallowMount( LabelEdit, {
			store: createStoreWithLanguage( { code: 'en', directionality: 'ltr' } ),
			propsData: {
				label: null,
				languageCode: 'en',
				isPrimary: true,
			},
		} );

		expect( wrapper.props() ).toHaveProperty( 'isPrimary', true );
		expect( wrapper.classes() ).toContain( 'wb-ui-label-edit--primary' );
	} );

	it( 'passes a placeholder down', () => {
		const placeholderMessage = 'placeholder';
		const wrapper = shallowMount( LabelEdit, {
			store: createStoreWithLanguage( { code: 'en', directionality: 'ltr' } ),
			propsData: {
				label: null,
				languageCode: 'en',
			},
			mixins: [
				mockMessageMixin( { [ MessageKey.PLACEHOLDER_EDIT_LABEL ]: placeholderMessage } ),
			],
		} );

		expect( wrapper.find( TermTextField ).attributes( 'placeholder' ) ).toBe( placeholderMessage );
	} );

	it( 'passes a maxlength down', () => {
		const maxLength = 23;
		const wrapper = shallowMount( LabelEdit, {
			store: createStoreWithLanguage( { code: 'en', directionality: 'ltr' } ),
			propsData: {
				label: null,
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
			shallowMount( LabelEdit, {
				propsData: {
					label: { language: languageCode, value: 'meep' },
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
