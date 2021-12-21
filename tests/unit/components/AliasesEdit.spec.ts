import {
	ComponentOptions,
	defineComponent,
	VNode,
} from 'vue';
import ResizingTextField from '@/components/ResizingTextField.vue';
import AliasesEdit from '@/components/AliasesEdit.vue';
import { DOMWrapper, mount, shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { action, mutation } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_ENTITY, NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { ENTITY_ALIAS_REMOVE, ENTITY_ALIASES_EDIT } from '@/store/entity/actionTypes';
import newFingerprintable from '../../newFingerprintable';
import { ENTITY_UPDATE } from '@/store/entity/mutationTypes';
import { Term } from '@wmde/wikibase-datamodel-types';
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

const language = 'en';

function getShallowMountedAliasEdit(
	aliases: string[],
	message = '',
	config: Pick<ConfigOptions, 'textFieldCharacterLimit'> = {
		textFieldCharacterLimit: 0,
	},
) {
	const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

	const mixins: ComponentOptions[] = [
		mockMessageMixin( { [ MessageKey.PLACEHOLDER_EDIT_ALIAS ]: message } ),
		newConfigMixin( config as ConfigOptions ),
	];

	return shallowMount( AliasesEdit, {
		props: {
			aliases: aliases.map( ( alias ) => ( { language, value: alias } ) ),
			languageCode: language,
		},
		mixins,
		global: { plugins: [ store ] },
	} );
}

/**
 * Get the v-for key of an element without a vue model (i.e. not a custom vue component but native HTML)
 * https://v3.vuejs.org/guide/list.html#maintaining-state
 */
function getWrappersVForKey( wrapper: DOMWrapper<Element> ) {
	// eslint-disable-next-line no-underscore-dangle
	return ( ( wrapper as any ).wrapperElement.__vnode as VNode ).key;
}

describe( 'AliasesEdit', () => {

	describe( 'editing', () => {
		it( 'triggers an edit action when the bottom blank field is edited', () => {
			const wrapper = getShallowMountedAliasEdit( [ 'foo' ] );
			const store = wrapper.vm.$store;
			store.dispatch = jest.fn();
			const newAlias = 'hello';
			wrapper.findAllComponents( ResizingTextField )[ 1 ].vm.$emit( 'input', newAlias );
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
			wrapper.findAllComponents( ResizingTextField )[ 0 ].vm.$emit( 'input', newAlias );
			expect( store.dispatch ).toBeCalledWith( action( NS_ENTITY, ENTITY_ALIASES_EDIT ), {
				language,
				aliasValues: [ newAlias ],
			} );
		} );

		it( 'passes a placeholder down', () => {
			const placeholderMessage = 'placeholder';
			const wrapper = getShallowMountedAliasEdit( [ 'foo' ], placeholderMessage );
			expect( wrapper.findComponent( ResizingTextField ).attributes( 'placeholder' ) ).toBe( placeholderMessage );
		} );

		it( 'passes a maxlength down', () => {
			const maxLength = 23;
			const wrapper = getShallowMountedAliasEdit(
				[ 'foo' ],
				'',
				{ textFieldCharacterLimit: maxLength },
			);
			expect( wrapper.findComponent( ResizingTextField ).attributes( 'maxlength' ) ).toBe( maxLength.toString() );
		} );
	} );

	describe( 'removing empty aliases', () => {
		it( `triggers ${ENTITY_ALIAS_REMOVE} when a blurring an empty text field`, () => {
			const wrapper = getShallowMountedAliasEdit( [ '' ] );
			const index = 0;
			const textField = wrapper.findAllComponents( ResizingTextField )[ index ];
			const store = wrapper.vm.$store;
			store.dispatch = jest.fn();

			textField.vm.$emit( 'blur' );
			expect( store.dispatch ).toHaveBeenCalledWith(
				action( NS_ENTITY, ENTITY_ALIAS_REMOVE ),
				{ languageCode: language, index },
			);
		} );

		it(
			'has the correct keys after removing an empty field on blur when store feeds into the aliases prop',
			async () => {
				const store = createStoreWithLanguage( { code: 'en', directionality: 'ltr' } );
				store.commit(
					mutation( NS_ENTITY, ENTITY_UPDATE ),
					newFingerprintable( { aliases: { en: [ 'foo', 'bar' ] } } ),
				);

				const wrapper = mount( defineComponent( {
					template: '<AliasesEdit :aliases="aliases()" language-code="en" />',
					components: { AliasesEdit },
					methods: {
						aliases(): Term[] {
							return this.$store.state.entity.aliases.en;
						},
					},
				} ), { global: {
					plugins: [ store ],
					mixins: [ newConfigMixin( { textFieldCharacterLimit: 0 } as ConfigOptions ) ],
				} } );

				const firstField = wrapper.findComponent( ResizingTextField );
				await firstField.vm.$emit( 'input', '' );
				await firstField.vm.$emit( 'blur' );

				const textFields = wrapper.findAllComponents( ResizingTextField );
				expect( textFields ).toHaveLength( 2 );
				expect( getWrappersVForKey( wrapper.findAll( 'li' )[ 0 ] ) ).toBe( 1 );
				expect( textFields[ 0 ].props( 'value' ) ).toBe( 'bar' );
			},
		);

		it( `triggers ${ENTITY_ALIAS_REMOVE} when a blurring a text field with only whitespace`, () => {
			const wrapper = getShallowMountedAliasEdit( [ '    ' ] );
			const index = 0;
			const textField = wrapper.findAllComponents( ResizingTextField )[ index ];
			const store = wrapper.vm.$store;
			store.dispatch = jest.fn();

			textField.vm.$emit( 'blur' );
			expect( store.dispatch ).toHaveBeenCalledWith(
				action( NS_ENTITY, ENTITY_ALIAS_REMOVE ),
				{ languageCode: language, index },
			);
		} );

		it( `does not trigger ${ENTITY_ALIAS_REMOVE} when blurring the bottom blank field`, () => {
			const wrapper = getShallowMountedAliasEdit( [ 'hi' ] );
			const store = wrapper.vm.$store;
			store.dispatch = jest.fn();

			const textFields = wrapper.findAllComponents( ResizingTextField );
			const bottomTextField = textFields[ 1 ];

			bottomTextField.vm.$emit( 'blur' );
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
			const textFields = wrapper.findAllComponents( ResizingTextField );
			expect( getWrappersVForKey( aliasItems[ 0 ] ) ).toBe( 0 );
			expect( textFields[ 0 ].props( 'value' ) ).toBe( aliases[ 0 ] );
			expect( getWrappersVForKey( aliasItems[ 1 ] ) ).toBe( 1 );
			expect( textFields[ 1 ].props( 'value' ) ).toBe( aliases[ 1 ] );
		} );

		it( 'has one extra blank text field at the bottom', () => {
			const wrapper = getShallowMountedAliasEdit( [ 'hi' ] );
			const textFields = wrapper.findAllComponents( ResizingTextField );

			return wrapper.vm.$nextTick().then( () => {
				expect( textFields[ 0 ].props( 'value' ) ).toBe( 'hi' );
				expect( textFields ).toHaveLength( 2 );
				expect( textFields[ 1 ].props( 'value' ) ).toBe( '' );
			} );
		} );

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const languageCode = 'de';
			const language = { code: languageCode, directionality: 'ltr' };
			const inlanguage = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( AliasesEdit, {
				props: {
					aliases: [
						{ language: languageCode, value: 'hello' },
						{ language: languageCode, value: 'hello2' },
					],
					languageCode,
				},
				global: {
					plugins: [ store ],
					directives: {
						inlanguage,
					},
					mixins: [ newConfigMixin( { textFieldCharacterLimit: 0 } as ConfigOptions ) ],
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
				props: { aliases: null, languageCode: 'en' },
				global: {
					plugins: [ store ],
					mixins: [ newConfigMixin( { textFieldCharacterLimit: 0 } as ConfigOptions ) ],
				},
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

		it( 'is shown if an alias is focused', async () => {
			const aliases = [ 'hi', 'hello' ];
			const wrapper = getShallowMountedAliasEdit( aliases );

			const textField = wrapper.findComponent( ResizingTextField );
			await textField.vm.$emit( 'focus' );

			expect( wrapper.find( '.wb-ui-aliases-edit--focus-within' ).exists() ).toBeTruthy();
		} );

		it( 'is removed if the alias loses focus', async () => {
			const aliases = [ 'hi', 'hello' ];
			const wrapper = getShallowMountedAliasEdit( aliases );

			const textField = wrapper.findComponent( ResizingTextField );
			textField.vm.$emit( 'focus' );
			await textField.vm.$emit( 'blur' );

			expect( wrapper.find( '.wb-ui-aliases-edit--focus-within' ).exists() ).toBeFalsy();
		} );

	} );

} );
