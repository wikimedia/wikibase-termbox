import TermTextField from '@/components/TermTextField.vue';
import AliasesEdit from '@/components/AliasesEdit.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';

function createStoreWithLanguage( language: Language ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ language.code ]: language,
	} );
	return store;
}

function getShallowMountedAliasEdit( aliases: string[] ) {
	const language = 'en';
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

	it( 'adds another blank text field at the bottom when entering content into the empty field', () => {
		const wrapper = getShallowMountedAliasEdit( [] );
		const newAlias = 'hello';
		wrapper.find( TermTextField ).vm.$emit( 'input', newAlias );

		const textFields = wrapper.findAll( TermTextField );
		expect( textFields ).toHaveLength( 2 );
		expect( textFields.at( 0 ).props( 'value' ) ).toBe( newAlias );
		expect( textFields.at( 1 ).props( 'value' ) ).toBe( '' );
	} );

	describe( 'removing empty aliases', () => {
		it( 'removes empty alias text fields on blur', () => {
			const wrapper = getShallowMountedAliasEdit( [ 'hi' ] );
			const textFields = wrapper.findAll( TermTextField );
			const textField = textFields.at( 0 );

			textField.vm.$emit( 'input', '' );
			expect( textFields ).toHaveLength( 2 );

			textField.trigger( 'blur.native' );
			expect( wrapper.findAll( TermTextField ) ).toHaveLength( 1 );
		} );

		it( 'removes whitespace-only alias text fields on blur', () => {
			const wrapper = getShallowMountedAliasEdit( [ 'hi' ] );
			const textFields = wrapper.findAll( TermTextField );
			const textField = textFields.at( 0 );

			textField.vm.$emit( 'input', '    ' );
			expect( textFields ).toHaveLength( 2 );

			textField.trigger( 'blur.native' );
			expect( wrapper.findAll( TermTextField ) ).toHaveLength( 1 );
		} );

		it( 'does not remove the bottom text field when empty on blur', () => {
			const wrapper = getShallowMountedAliasEdit( [ 'hi' ] );

			const textFields = wrapper.findAll( TermTextField );
			const bottomTextField = textFields.at( 1 );

			bottomTextField.vm.$emit( 'input', '' );
			expect( textFields ).toHaveLength( 2 );

			bottomTextField.trigger( 'blur.native' );
			expect( wrapper.findAll( TermTextField ) ).toHaveLength( 2 );
		} );
	} );

	describe( 'on mount', () => {
		it( 'makes the aliases in the given language editable as individual text fields', () => {
			let aliases = [ 'hi', 'hello' ];
			const wrapper = getShallowMountedAliasEdit( aliases );

			const textFields = wrapper.findAll( TermTextField );
			expect( textFields.at( 0 ).props( 'value' ) ).toBe( aliases[ 0 ] );
			expect( textFields.at( 1 ).props( 'value' ) ).toBe( aliases[ 1 ] );
		} );

		it( 'has one extra blank text field at the bottom', () => {
			const wrapper = getShallowMountedAliasEdit( [ 'hi' ] );
			const textFields = wrapper.findAll( TermTextField );

			expect( textFields ).toHaveLength( 2 );
			expect( textFields.at( 1 ).props( 'value' ) ).toBe( '' );
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
