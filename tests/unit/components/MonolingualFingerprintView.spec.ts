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
import { mutation, action } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { ENTITY_UPDATE } from '@/store/entity/mutationTypes';
import { EDITMODE_SET } from '@/store/mutationTypes';
import newFingerprintable from '../../newFingerprintable';
import hotUpdateDeep from '@wmde/vuex-helpers/dist/hotUpdateDeep';
import emptyServices from '../emptyServices';
import { ENTITY_DESCRIPTION_EDIT, ENTITY_LABEL_EDIT } from '@/store/entity/actionTypes';

function createMinimalStoreWithLanguage( languageCode: string ) {
	const store = createStore( emptyServices as any );
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

			const store = createStore( emptyServices as any );
			store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), { de: language } );
			store.commit( mutation( NS_ENTITY, ENTITY_UPDATE ), entity );
			store.commit( EDITMODE_SET, false );

			const wrapper = shallowMount( MonolingualFingerprintView, {
				global: { plugins: [ store ] },
				props: { languageCode: language.code },
			} );

			expect( wrapper.findComponent( Label ).exists() ).toBeTruthy();
			expect( wrapper.findComponent( Label ).props( 'label' ) ).toStrictEqual( entity.labels[ language.code ] );

			expect( wrapper.findComponent( Description ).exists() ).toBeTruthy();
			expect( wrapper.findComponent( Description ).props( 'description' ) )
				.toStrictEqual( entity.descriptions[ language.code ] );

			expect( wrapper.findComponent( Aliases ).exists() ).toBeTruthy();
			expect( wrapper.findComponent( Aliases ).props( 'aliases' ) )
				.toStrictEqual( entity.aliases[ language.code ] );
		} );

		it( 'renders in editmode', () => {
			const entity = newFingerprintable( {
				labels: { de: 'Kartoffel' },
				descriptions: { de: 'Art der Gattung Nachtschatten (Solanum)' },
				aliases: { de: [ 'Erdapfel', 'Solanum tuberosum' ] },
			} );

			const languageCode = 'de';
			const language = { code: languageCode, directionality: 'ltr' };

			const store = createStore( emptyServices as any );
			store.commit( mutation( NS_LANGUAGE, LANGUAGE_UPDATE ), { de: language } );
			store.commit( mutation( NS_ENTITY, ENTITY_UPDATE ), entity );
			store.commit( EDITMODE_SET, true );

			const wrapper = shallowMount( MonolingualFingerprintView, {
				global: { plugins: [ store ] },
				props: { languageCode: language.code },
			} );

			expect( wrapper.findComponent( LabelEdit ).exists() ).toBeTruthy();
			expect( wrapper.findComponent( LabelEdit ).props( 'label' ) )
				.toStrictEqual( entity.labels[ language.code ] );
			expect( wrapper.findComponent( LabelEdit ).props( 'languageCode' ) ).toBe( languageCode );

			expect( wrapper.findComponent( DescriptionEdit ).exists() ).toBeTruthy();
			expect( wrapper.findComponent( DescriptionEdit ).props( 'description' ) )
				.toStrictEqual( entity.descriptions[ language.code ] );
			expect( wrapper.findComponent( DescriptionEdit ).props( 'languageCode' ) ).toBe( languageCode );

			expect( wrapper.findComponent( AliasesEdit ).exists() ).toBeTruthy();
			expect( wrapper.findComponent( AliasesEdit ).props( 'languageCode' ) ).toBe( languageCode );
			expect( wrapper.findComponent( AliasesEdit ).props( 'aliases' ) )
				.toStrictEqual( entity.aliases[ language.code ] );
		} );

		it( 'triggers ENTITY_LABEL_EDIT on label edits', () => {
			const languageCode = 'de';

			const store = createStore( emptyServices as any );
			store.dispatch = jest.fn();

			store.commit( EDITMODE_SET, true );

			const wrapper = shallowMount( MonolingualFingerprintView, {
				global: { plugins: [ store ] },
				props: {
					label: { language: languageCode, value: 'oldValue' },
					languageCode,
				},
			} );

			const newValue = { language: languageCode, value: 'newValue' };
			const labelEdit = wrapper.findComponent( LabelEdit );
			labelEdit.vm.$emit( 'input', newValue );

			expect( store.dispatch )
				.toHaveBeenCalledWith( action( NS_ENTITY, ENTITY_LABEL_EDIT ), newValue );
		} );
	} );

	it( 'triggers ENTITY_DESCRIPTION_EDIT on description edits', () => {
		const store = createStore( emptyServices as any );
		store.dispatch = jest.fn();
		store.commit( EDITMODE_SET, true );

		const languageCode = 'de';
		const wrapper = shallowMount( MonolingualFingerprintView, {
			global: { plugins: [ store ] },
			props: { languageCode },
		} );

		const newValue = { language: languageCode, value: 'newValue' };
		const descriptionEdit = wrapper.findComponent( DescriptionEdit );
		descriptionEdit.vm.$emit( 'input', newValue );

		expect( store.dispatch )
			.toHaveBeenCalledWith( action( NS_ENTITY, ENTITY_DESCRIPTION_EDIT ), newValue );
	} );

	describe( 'primary Fingerprint', () => {
		it( 'renders the component with primaryLanguage modifier and primary label if isPrimary flag is true', () => {
			const languageCode = 'en';
			const store = createMinimalStoreWithLanguage( languageCode );
			const wrapper = shallowMount(
				MonolingualFingerprintView,
				{
					global: { plugins: [ store ] },
					props: {
						isPrimary: true,
						languageCode,
					},
				},
			);
			expect( wrapper.classes( 'wb-ui-monolingualfingerprintview--primaryLanguage' ) ).toBeTruthy();
			expect( wrapper.findComponent( Label ).props() ).toHaveProperty( 'isPrimary', true );
		} );

		it( 'renders the component with no modifier and no primary label if isPrimary flag is false', () => {
			const languageCode = 'en';
			const store = createMinimalStoreWithLanguage( languageCode );
			const wrapper = shallowMount(
				MonolingualFingerprintView,
				{
					global: { plugins: [ store ] },
					props: {
						isPrimary: false,
						languageCode,
					},
				},
			);
			expect( wrapper.classes() ).toEqual( [ 'wb-ui-monolingualfingerprintview' ] );
			expect( wrapper.findComponent( Label ).props() ).toHaveProperty( 'isPrimary', false );
		} );
	} );

	it( 'delegates the translation of the name of the language to the getTranslationInUserLanguage getter', () => {
		const languageCode = 'de';
		const languageTranslation = 'Teutonic';

		const getTranslationInUserLanguage = jest.fn().mockReturnValue( languageTranslation );
		const store = hotUpdateDeep( createStore( emptyServices as any ), {
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
				global: { plugins: [ store ] },
				props: {
					languageCode,
				},
			},
		);

		const languageNameInUserLanguage = wrapper.find( '.wb-ui-monolingualfingerprintview__language' );
		expect( getTranslationInUserLanguage ).toHaveBeenCalledWith( languageCode );
		expect( languageNameInUserLanguage.element.tagName ).toBe( 'SPAN' );
		expect( languageNameInUserLanguage.text() ).toBe( languageTranslation );
	} );

} );
