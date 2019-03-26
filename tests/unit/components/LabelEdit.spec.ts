import LabelEdit from '@/components/LabelEdit.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';

const LABEL_SELECTOR = '.wb-ui-label-edit';

function createStoreWithLanguage( language: Language ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ language.code ]: language,
	} );
	return store;
}

describe( 'LabelEdit', () => {

	it( 'makes the given label in the given language editable', () => {
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

		const editSection = wrapper.find( LABEL_SELECTOR ).element as HTMLTextAreaElement;
		expect( editSection.value ).toBe( label );

	} );

	describe( 'directionality and language code', () => {

		it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
			const language = { code: 'en', directionality: 'ltr' };
			const inlanguageDirective = jest.fn();
			const store = createStoreWithLanguage( language );
			shallowMount( LabelEdit, {
				propsData: {
					label: { language: 'en', value: 'meep' },
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
