import { shallowMount } from '@vue/test-utils';
import Fingerprint from '@/components/Fingerprint.vue';
import LanguageNameInUserLanguage from '@/components/LanguageNameInUserLanguage.vue';
import Label from '@/components/Label.vue';
import Description from '@/components/Description.vue';
import Aliases from '@/components/Aliases.vue';
import { createStore } from '@/store';
import { NS_LANGUAGE } from '@/store/namespaces';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { mutation } from '@/store/util';

function createMinimalStoreWithLanguage( languageCode: string ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ languageCode ]: { code: languageCode, directionality: 'ltr' },
	} );

	return store;
}

describe( 'Fingerprint.vue', () => {

	it( 'renders label, description and aliases in the given language', () => {
		const language = { code: 'de', directionality: 'ltr' };

		const store = createStore();
		store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), { de: language } );

		const wrapper = shallowMount( Fingerprint, { store, propsData: { languageCode: language.code } } );

		expect( wrapper.find( Label ).props( 'language' ) ).toBe( language );
		expect( wrapper.find( Description ).props( 'language' ) ).toBe( language );
		expect( wrapper.find( Aliases ).props( 'language' ) ).toBe( language );
	} );

	describe( 'primary Fingerprint', () => {
		it( 'renders the component with primaryLanguage modifier and primary label if isPrimary flag is true', () => {
			const languageCode = 'en';
			const store = createMinimalStoreWithLanguage( languageCode );
			const wrapper = shallowMount(
				Fingerprint,
				{
					store,
					propsData: {
						isPrimary: true,
						languageCode,
					},
				},
			);
			expect( wrapper.classes( 'wikibase-termbox-fingerprint--primaryLanguage' ) ).toBeTruthy();
			expect( wrapper.find( Label ).props() ).toHaveProperty( 'isPrimary', true );
		} );

		it( 'renders the component with no modifier and no primary label if isPrimary flag is false', () => {
			const languageCode = 'en';
			const store = createMinimalStoreWithLanguage( languageCode );
			const wrapper = shallowMount(
				Fingerprint,
				{
					store,
					propsData: {
						isPrimary: false,
						languageCode,
					},
				},
			);
			expect( wrapper.classes() ).toEqual( [ 'wikibase-termbox-fingerprint' ] );
			expect( wrapper.find( Label ).props() ).toHaveProperty( 'isPrimary', false );
		} );
	} );

	it( 'delegates the translation of the name of the language to LanguageNameInUserLanguage', () => {
		const language = { code: 'de', directionality: 'ltr' };

		const store = createStore();
		store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), { de: language } );
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					languageCode: language.code,
				},
			},
		);

		const languageNameInUserLanguage = wrapper.find( '.wikibase-termbox-fingerprint__language' );

		expect( languageNameInUserLanguage.is( LanguageNameInUserLanguage ) ).toBeTruthy();
		expect( languageNameInUserLanguage.props( 'language' ) ).toBe( language );
	} );

} );
