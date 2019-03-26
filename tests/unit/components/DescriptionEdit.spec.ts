import DescriptionEdit from '@/components/DescriptionEdit.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';

const DESCRIPTION_SELECTOR = '.wb-ui-description-edit';

function createStoreWithLanguage( language: Language ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ language.code ]: language,
	} );
	return store;
}

describe( 'DescriptionEdit', () => {

	it( 'makes the given description in the given language editable', () => {
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

		const editSection = wrapper.find( DESCRIPTION_SELECTOR ).element as HTMLTextAreaElement;
		expect( editSection.value ).toBe( description );

	} );

	describe( 'directionality and language code', () => {

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const language = { code: 'en', directionality: 'ltr' };
			const inlanguageDirective = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( DescriptionEdit, {
				propsData: {
					description: { language: 'en', value: 'meep' },
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
