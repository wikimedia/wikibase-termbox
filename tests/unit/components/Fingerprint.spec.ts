import { shallowMount } from '@vue/test-utils';
import Fingerprint from '@/components/Fingerprint.vue';
import LanguageNameInUserLanguage from '@/components/LanguageNameInUserLanguage.vue';
import Label from '@/components/Label.vue';
import Description from '@/components/Description.vue';
import Aliases from '@/components/Aliases.vue';
import { createStore } from '@/store';
import { NS_LANGUAGE, NS_ENTITY } from '@/store/namespaces';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { mutation } from '@/store/util';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import newFingerprintable from '../../newFingerprintable';

function createMinimalStoreWithLanguage( languageCode: string ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ languageCode ]: { code: languageCode, directionality: 'ltr' },
	} );

	return store;
}

describe( 'Fingerprint.vue', () => {

	it( 'renders label, description and aliases in the given language', () => {
		const entity = newFingerprintable( {
			labels: { de: 'Kartoffel' },
			descriptions: { de: 'Art der Gattung Nachtschatten (Solanum)' },
			aliases: { de: [ 'Erdapfel', 'Solanum tuberosum' ] },
		} );
		const language = { code: 'de', directionality: 'ltr' };

		const store = createStore();
		store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), { de: language } );
		store.commit( mutation( NS_ENTITY, ENTITY_INIT ), entity );

		const wrapper = shallowMount( Fingerprint, { store, propsData: { languageCode: language.code } } );

		expect( wrapper.find( Label ).props( 'label' ) ).toBe( entity.labels[ language.code ] );
		expect( wrapper.find( Description ).props( 'description' ) ).toBe( entity.descriptions[ language.code ] );
		expect( wrapper.find( Aliases ).props( 'aliases' ) ).toBe( entity.aliases[ language.code ] );
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
			expect( wrapper.classes( 'wb-ui-fingerprint--primaryLanguage' ) ).toBeTruthy();
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
			expect( wrapper.classes() ).toEqual( [ 'wb-ui-fingerprint' ] );
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

		const languageNameInUserLanguage = wrapper.find( '.wb-ui-fingerprint__language' );

		expect( languageNameInUserLanguage.is( LanguageNameInUserLanguage ) ).toBeTruthy();
		expect( languageNameInUserLanguage.props( 'language' ) ).toBe( language );
	} );

} );
