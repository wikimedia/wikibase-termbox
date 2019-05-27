import { shallowMount } from '@vue/test-utils';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import Label from '@/components/Label.vue';
import LabelEdit from '@/components/LabelEdit.vue';
import Description from '@/components/Description.vue';
import DescriptionEdit from '@/components/DescriptionEdit.vue';
import Aliases from '@/components/Aliases.vue';
import AliasesEdit from '@/components/AliasesEdit.vue';
import { createStore } from '@/store';
import { NS_LANGUAGE, NS_ENTITY } from '@/store/namespaces';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { mutation } from '@/store/util';
import { ENTITY_UPDATE } from '@/store/entity/mutationTypes';
import { EDITMODE_SET } from '@/store/mutationTypes';
import newFingerprintable from '../../newFingerprintable';
import createMockableStore from '../store/createMockableStore';

function createMinimalStoreWithLanguage( languageCode: string ) {
	const store = createStore();
	store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), {
		[ languageCode ]: { code: languageCode, directionality: 'ltr' },
	} );

	store.commit( EDITMODE_SET, false );

	return store;
}

describe( 'MonolingualFingerprintView.vue', () => {

	describe( 'label, description and aliases in the given language', () => {

		it( 'rendered in readmode', () => {
			const entity = newFingerprintable( {
				labels: { de: 'Kartoffel' },
				descriptions: { de: 'Art der Gattung Nachtschatten (Solanum)' },
				aliases: { de: [ 'Erdapfel', 'Solanum tuberosum' ] },
			} );

			const language = { code: 'de', directionality: 'ltr' };

			const store = createStore();
			store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), { de: language } );
			store.commit( mutation( NS_ENTITY, ENTITY_UPDATE ), entity );
			store.commit( EDITMODE_SET, false );

			const wrapper = shallowMount(
				MonolingualFingerprintView,
				{ store, propsData: { languageCode: language.code } },
			);

			expect( wrapper.find( Label ).exists() ).toBeTruthy();
			expect( wrapper.find( Label ).props( 'label' ) ).toBe( entity.labels[ language.code ] );

			expect( wrapper.find( Description ).exists() ).toBeTruthy();
			expect( wrapper.find( Description ).props( 'description' ) ).toBe( entity.descriptions[ language.code ] );

			expect( wrapper.find( Aliases ).exists() ).toBeTruthy();
			expect( wrapper.find( Aliases ).props( 'aliases' ) ).toBe( entity.aliases[ language.code ] );
		} );

		it( 'renders in editmode', () => {
			const entity = newFingerprintable( {
				labels: { de: 'Kartoffel' },
				descriptions: { de: 'Art der Gattung Nachtschatten (Solanum)' },
				aliases: { de: [ 'Erdapfel', 'Solanum tuberosum' ] },
			} );

			const languageCode = 'de';
			const language = { code: languageCode, directionality: 'ltr' };

			const store = createStore();
			store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), { de: language } );
			store.commit( mutation( NS_ENTITY, ENTITY_UPDATE ), entity );
			store.commit( EDITMODE_SET, true );

			const wrapper = shallowMount( MonolingualFingerprintView, {
				store,
				propsData: { languageCode: language.code },
			} );

			expect( wrapper.find( LabelEdit ).exists() ).toBeTruthy();
			expect( wrapper.find( LabelEdit ).props( 'label' ) ).toBe( entity.labels[ language.code ] );
			expect( wrapper.find( LabelEdit ).props( 'languageCode' ) ).toBe( languageCode );

			expect( wrapper.find( DescriptionEdit ).exists() ).toBeTruthy();
			expect( wrapper.find( DescriptionEdit ).props( 'description' ) )
				.toBe( entity.descriptions[ language.code ] );
			expect( wrapper.find( DescriptionEdit ).props( 'languageCode' ) ).toBe( languageCode );

			expect( wrapper.find( AliasesEdit ).exists() ).toBeTruthy();
			expect( wrapper.find( AliasesEdit ).props( 'languageCode' ) ).toBe( languageCode );
			expect( wrapper.find( AliasesEdit ).props( 'aliases' ) ).toBe( entity.aliases[ language.code ] );
		} );
	} );

	describe( 'primary Fingerprint', () => {
		it( 'renders the component with primaryLanguage modifier and primary label if isPrimary flag is true', () => {
			const languageCode = 'en';
			const store = createMinimalStoreWithLanguage( languageCode );
			const wrapper = shallowMount(
				MonolingualFingerprintView,
				{
					store,
					propsData: {
						isPrimary: true,
						languageCode,
					},
				},
			);
			expect( wrapper.classes( 'wb-ui-monolingualfingerprintview--primaryLanguage' ) ).toBeTruthy();
			expect( wrapper.find( Label ).props() ).toHaveProperty( 'isPrimary', true );
		} );

		it( 'renders the component with no modifier and no primary label if isPrimary flag is false', () => {
			const languageCode = 'en';
			const store = createMinimalStoreWithLanguage( languageCode );
			const wrapper = shallowMount(
				MonolingualFingerprintView,
				{
					store,
					propsData: {
						isPrimary: false,
						languageCode,
					},
				},
			);
			expect( wrapper.classes() ).toEqual( [ 'wb-ui-monolingualfingerprintview' ] );
			expect( wrapper.find( Label ).props() ).toHaveProperty( 'isPrimary', false );
		} );
	} );

	it( 'delegates the translation of the name of the language to the getTranslationInUserLanguage getter', () => {
		const languageCode = 'de';
		const languageTranslation = 'Teutonic';

		const getTranslationInUserLanguage = jest.fn().mockReturnValue( languageTranslation );
		const store = createMockableStore( {
			modules: {
				[ NS_LANGUAGE ]: {
					getters: {
						getTranslationInUserLanguage: () => getTranslationInUserLanguage,
					},
				},
			},
		} );

		const wrapper = shallowMount(
			MonolingualFingerprintView,
			{
				store,
				propsData: {
					languageCode,
				},
			},
		);

		const languageNameInUserLanguage = wrapper.find( '.wb-ui-monolingualfingerprintview__language' );
		expect( getTranslationInUserLanguage ).toHaveBeenCalledWith( languageCode );
		expect( languageNameInUserLanguage.is( 'span' ) ).toBeTruthy();
		expect( languageNameInUserLanguage.text() ).toBe( languageTranslation );
	} );

} );
