import Vue, { ComponentOptions, VNode } from 'vue';
import TermTextField from '@/components/TermTextField.vue';
import AliasesEdit from '@/components/AliasesEdit.vue';
import { mount, shallowMount, Wrapper } from '@vue/test-utils';
import { createStore } from '@/store';
import { action, mutation } from '@/store/util';
import { NS_ENTITY, NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { ENTITY_ALIAS_REMOVE, ENTITY_ALIASES_EDIT } from '@/store/entity/actionTypes';
import newFingerprintable from '../../newFingerprintable';
import { ENTITY_UPDATE } from '@/store/entity/mutationTypes';
import Term from '@/datamodel/Term';
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

const language = 'en';

function getShallowMountedAliasEdit(
	aliases: string[],
	message = '',
	config?: ConfigOptions,
) {
	const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

	const mixins: ( ComponentOptions<Vue> | typeof Vue )[] = [
		mockMessageMixin( { [ MessageKey.PLACEHOLDER_EDIT_ALIAS ]: message } ),
	];

	if ( config ) {
		mixins.push( newConfigMixin( config ) );
	}

	return shallowMount( AliasesEdit, {
		propsData: {
			aliases: aliases.map( ( alias ) => ( { language, value: alias } ) ),
			languageCode: language,
		},
		store,
		mixins,
	} );
}

/**
 * Get the v-for key of an element without a vue model (i.e. not a custom vue component but native HTML)
 * https://vuejs.org/v2/guide/list.html#Maintaining-State
 */
function getWrappersVForKey( wrapper: Wrapper<Vue> ) {
	return ( ( wrapper as any ).vnode as VNode ).key;
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

		it( 'passes a placeholder down', () => {
			const placeholderMessage = 'placeholder';
			const wrapper = getShallowMountedAliasEdit( [ 'foo' ], placeholderMessage );
			expect( wrapper.find( TermTextField ).attributes( 'placeholder' ) ).toBe( placeholderMessage );
		} );

		it( 'passes a maxlength down', () => {
			const maxLength = 23;
			const wrapper = getShallowMountedAliasEdit(
				[ 'foo' ],
				'',
				{ textFieldCharacterLimit: maxLength } as ConfigOptions,
			);
			expect( wrapper.find( TermTextField ).attributes( 'maxlength' ) ).toBe( maxLength.toString() );
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

		it( 'has the correct keys after removing an empty field on blur when store feeds into the aliases prop', () => {
			const store = createStoreWithLanguage( { code: 'en', directionality: 'ltr' } );
			store.commit(
				mutation( NS_ENTITY, ENTITY_UPDATE ),
				newFingerprintable( { aliases: { en: [ 'foo', 'bar' ] } } ),
			);

			const wrapper = mount( Vue.extend( {
				template: '<AliasesEdit :aliases="aliases()" language-code="en" />',
				components: { AliasesEdit },
				methods: {
					aliases(): Term[] {
						return this.$store.state.entity.aliases.en;
					},
				},
				store,
			} ) );

			const firstField = wrapper.find( TermTextField );
			firstField.vm.$emit( 'input', '' );
			firstField.trigger( 'blur.native' );

			const textFields = wrapper.findAll( TermTextField );
			expect( textFields ).toHaveLength( 2 );
			expect( getWrappersVForKey( wrapper.findAll( 'li' ).at( 0 ) ) ).toBe( 1 );
			expect( textFields.at( 0 ).props( 'value' ) ).toBe( 'bar' );
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
		it( 'makes the aliases in the given language editable as individual text fields with appropriate keys', () => {
			const aliases = [ 'hi', 'hello' ];
			const wrapper = getShallowMountedAliasEdit( aliases );

			const aliasItems = wrapper.findAll( 'li' );
			const textFields = wrapper.findAll( TermTextField );
			expect( getWrappersVForKey( aliasItems.at( 0 ) ) ).toBe( 0 );
			expect( textFields.at( 0 ).props( 'value' ) ).toBe( aliases[ 0 ] );
			expect( getWrappersVForKey( aliasItems.at( 1 ) ) ).toBe( 1 );
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
			const languageCode = 'de';
			const language = { code: languageCode, directionality: 'ltr' };
			const inlanguage = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( AliasesEdit, {
				propsData: {
					aliases: [
						{ language: languageCode, value: 'hello' },
						{ language: languageCode, value: 'hello2' },
					],
					languageCode,
				},
				store,
				directives: {
					inlanguage,
				},
			} );

			expect( inlanguage ).toHaveBeenCalledTimes( 3 );
			expect( inlanguage.mock.calls[ 0 ][ 1 ].value ).toBe( languageCode );
			expect( inlanguage.mock.calls[ 1 ][ 1 ].value ).toBe( languageCode );
			expect( inlanguage.mock.calls[ 2 ][ 1 ].value ).toBe( languageCode );
		} );

		it( 'transforms non-existent aliases into an alias list with one empty string', () => {
			const store = createStoreWithLanguage( { code: 'en', directionality: 'ltr' } );
			const wrapper = shallowMount( AliasesEdit, {
				propsData: { aliases: null, languageCode: 'en' },
				store,
			} );

			expect( ( wrapper.vm as any ).aliasValues ).toEqual( [ '' ] );
		} );

	} );

	describe( 'Focus indication', () => {

		it( 'is not shown by default', () => {
			const aliases = [ 'hi', 'hello' ];
			const wrapper = getShallowMountedAliasEdit( aliases );

			expect( wrapper.find( '.wb-ui-aliases-edit--focus-within' ).exists() ).toBeFalsy();
		} );

		it( 'is shown if an alias is focused', () => {
			const aliases = [ 'hi', 'hello' ];
			const wrapper = getShallowMountedAliasEdit( aliases );

			const textField = wrapper.find( TermTextField );
			textField.trigger( 'focus' );

			expect( wrapper.find( '.wb-ui-aliases-edit--focus-within' ).exists() ).toBeTruthy();
		} );

		it( 'is removed if the alias loses focus', () => {
			const aliases = [ 'hi', 'hello' ];
			const wrapper = getShallowMountedAliasEdit( aliases );

			const textField = wrapper.find( TermTextField );
			textField.trigger( 'focus' );
			textField.trigger( 'blur.native' );

			expect( wrapper.find( '.wb-ui-aliases-edit--focus-within' ).exists() ).toBeFalsy();
		} );

	} );

} );
