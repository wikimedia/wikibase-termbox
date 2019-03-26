import AliasesEdit from '@/components/AliasesEdit.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';

const ALIASES_SELECTOR = '.wb-ui-aliases-edit';

function createStoreWithLanguage( language: Language ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ language.code ]: language,
	} );
	return store;
}

describe( 'AliasesEdit', () => {

	it( 'makes the given aliases in the given language editable as a list separated by newline', () => {
		const language = 'en';
		const store = createStoreWithLanguage( { code: language, directionality: 'ltr' } );

		const aliases = [
			{ language, value: 'hello' },
			{ language, value: 'hello2' },
		];

		const wrapper = shallowMount( AliasesEdit, {
			propsData: {
				aliases,
				languageCode: language,
			},
			store,
		} );

		const editSection = wrapper.find( ALIASES_SELECTOR ).element as HTMLTextAreaElement;
		expect( editSection.value ).toBe( 'hello\nhello2' );

	} );

	describe( 'directionality and language code', () => {

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const language = { code: 'en', directionality: 'ltr' };
			const inlanguageDirective = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( AliasesEdit, {
				propsData: {
					aliases: [
						{ language, value: 'hello' },
						{ language, value: 'hello2' },
					],
					languageCode: 'en',
				},
				store,
				directives: {
					inlanguage: inlanguageDirective,
				},
			} );

			expect( inlanguageDirective ).toBeCalledTimes( 1 );
			expect( inlanguageDirective.mock.calls[0][1].value ).toBe( language );
		} );

	} );

} );
