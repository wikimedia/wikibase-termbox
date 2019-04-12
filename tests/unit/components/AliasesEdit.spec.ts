import Vue from 'vue';
import TermTextField from '@/components/TermTextField.vue';
import AliasesEdit from '@/components/AliasesEdit.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_ENTITY, NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { action } from '@/store/util';
import { ENTITY_ALIAS_REMOVE, ENTITY_ALIASES_EDIT } from '@/store/entity/actionTypes';

function createStoreWithLanguage( language: Language ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ language.code ]: language,
	} );
	return store;
}

const language = 'en';

function getShallowMountedAliasEdit( aliases: string[] ) {
	const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

	return shallowMount( AliasesEdit, {
		propsData: {
			aliases: aliases.map( ( alias ) => ( { language, value: alias } ) ),
			languageCode: language,
		},
		store,
	} );
}

describe( 'AliasesEdit', () => {

	describe( 'editing', () => {
		it( 'triggers an edit action when the bottom blank field is edited', () => {
			const wrapper = getShallowMountedAliasEdit( [ 'foo' ] );
			const store = wrapper.vm.$store;
			store.dispatch = jest.fn();
			const newAlias = 'hello';
			wrapper.findAll( TermTextField ).at( 1 ).vm.$emit( 'input', newAlias );
			expect( store.dispatch ).toBeCalledWith( action( NS_ENTITY, ENTITY_ALIASES_EDIT ), {
				language,
				aliasValues: [ 'foo', 'hello' ],
			} );
		} );

		it( 'triggers an edit action not containing the bottom blank field when an existing alias is edited', () => {
			const wrapper = getShallowMountedAliasEdit( [ 'foo' ] );
			const store = wrapper.vm.$store;
			store.dispatch = jest.fn();
			const newAlias = 'fool';
			wrapper.findAll( TermTextField ).at( 0 ).vm.$emit( 'input', newAlias );
			expect( store.dispatch ).toBeCalledWith( action( NS_ENTITY, ENTITY_ALIASES_EDIT ), {
				language,
				aliasValues: [ newAlias ],
			} );
		} );
	} );

	describe( 'removing empty aliases', () => {
		it( `triggers ${ENTITY_ALIAS_REMOVE} when a blurring an empty text field`, () => {
			const wrapper = getShallowMountedAliasEdit( [ '' ] );
			const index = 0;
			const textField = wrapper.findAll( TermTextField ).at( index );
			const store = wrapper.vm.$store;
			store.dispatch = jest.fn();

			textField.trigger( 'blur.native' );
			expect( store.dispatch ).toHaveBeenCalledWith(
				action( NS_ENTITY, ENTITY_ALIAS_REMOVE ),
				{ languageCode: language, index },
			);
		} );

		it( `triggers ${ENTITY_ALIAS_REMOVE} when a blurring a text field with only whitespace`, () => {
			const wrapper = getShallowMountedAliasEdit( [ '    ' ] );
			const index = 0;
			const textField = wrapper.findAll( TermTextField ).at( index );
			const store = wrapper.vm.$store;
			store.dispatch = jest.fn();

			textField.trigger( 'blur.native' );
			expect( store.dispatch ).toHaveBeenCalledWith(
				action( NS_ENTITY, ENTITY_ALIAS_REMOVE ),
				{ languageCode: language, index },
			);
		} );

		it( `does not trigger ${ENTITY_ALIAS_REMOVE} when blurring the bottom blank field`, () => {
			const wrapper = getShallowMountedAliasEdit( [ 'hi' ] );
			const store = wrapper.vm.$store;
			store.dispatch = jest.fn();

			const textFields = wrapper.findAll( TermTextField );
			const bottomTextField = textFields.at( 1 );

			bottomTextField.trigger( 'blur.native' );
			expect( store.dispatch ).not.toHaveBeenCalledWith(
				action( NS_ENTITY, ENTITY_ALIAS_REMOVE ),
				expect.anything(),
			);
		} );
	} );

	describe( 'on mount', () => {
		it( 'makes the aliases in the given language editable as individual text fields', () => {
			const aliases = [ 'hi', 'hello' ];
			const wrapper = getShallowMountedAliasEdit( aliases );

			const textFields = wrapper.findAll( TermTextField );
			expect( textFields.at( 0 ).props( 'value' ) ).toBe( aliases[ 0 ] );
			expect( textFields.at( 1 ).props( 'value' ) ).toBe( aliases[ 1 ] );
		} );

		it( 'has one extra blank text field at the bottom', () => {
			const wrapper = getShallowMountedAliasEdit( [ 'hi' ] );
			const textFields = wrapper.findAll( TermTextField );

			return Vue.nextTick().then( () => {
				expect( textFields.at( 0 ).props( 'value' ) ).toBe( 'hi' );
				expect( textFields ).toHaveLength( 2 );
				expect( textFields.at( 1 ).props( 'value' ) ).toBe( '' );
			} );
		} );

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const language = { code: 'de', directionality: 'ltr' };
			const inlanguageDirective = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( AliasesEdit, {
				propsData: {
					aliases: [
						{ language: language.code, value: 'hello' },
						{ language: language.code, value: 'hello2' },
					],
					languageCode: 'de',
				},
				store,
				directives: {
					inlanguage: inlanguageDirective,
				},
			} );

			expect( inlanguageDirective ).toBeCalledTimes( 3 );
			expect( inlanguageDirective.mock.calls[ 0 ][ 1 ].value ).toBe( language );
			expect( inlanguageDirective.mock.calls[ 1 ][ 1 ].value ).toBe( language );
			expect( inlanguageDirective.mock.calls[ 2 ][ 1 ].value ).toBe( language );
		} );

	} );

} );
