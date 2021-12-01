import { shallowMount } from '@vue/test-utils';
import AllEnteredLanguages from '@/components/AllEnteredLanguages.vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import { createStore } from '@/store';
import {
	NS_USER,
} from '@/store/namespaces';
import { LANGUAGE_INIT, SECONDARY_LANGUAGES_INIT } from '@/store/user/mutationTypes';
import { mutation } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_ENTITY } from '@/store/namespaces';
import { ENTITY_UPDATE } from '@/store/entity/mutationTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import emptyServices from '../emptyServices';

describe( 'AllEnteredLanguages', () => {

	it( 'passes language prop to MonolingualFingerprintView', () => {
		const language = 'de';
		const store = createStore( emptyServices as any );
		store.commit( mutation( NS_ENTITY, ENTITY_UPDATE ), new FingerprintableEntity(
			'Q42',
			{ [ language ]: { language, value: 'kartoffel' } },
			{},
			{},
		) );

		const wrapper = shallowMount( AllEnteredLanguages, { global: { plugins: [ store ] } } );

		expect( wrapper.findComponent( MonolingualFingerprintView ).props( 'languageCode' ) ).toBe( language );
	} );

	it( 'does not contain the primary user language', () => {
		const store = createStore( emptyServices as any );
		store.commit( mutation( NS_USER, LANGUAGE_INIT ), 'de' );

		store.commit( mutation( NS_ENTITY, ENTITY_UPDATE ), new FingerprintableEntity(
			'Q42',
			{
				de: { language: 'de', value: 'kartoffel' },
				en: { language: 'en', value: 'potato' },
			},
			{},
			{},
		) );

		const wrapper = shallowMount( AllEnteredLanguages, { global: { plugins: [ store ] } } );

		expect( wrapper.findAllComponents( MonolingualFingerprintView ).length ).toBe( 1 );
		expect( wrapper.findComponent( MonolingualFingerprintView ).props( 'languageCode' ) ).toBe( 'en' );
	} );

	it( 'does not contain the secondary user languages', () => {
		const store = createStore( emptyServices as any );
		store.commit( mutation( NS_USER, SECONDARY_LANGUAGES_INIT ), [ 'en', 'fr' ] );

		store.commit( mutation( NS_ENTITY, ENTITY_UPDATE ), new FingerprintableEntity(
			'Q42',
			{
				de: { language: 'de', value: 'kartoffel' },
				en: { language: 'en', value: 'potato' },
				fr: { language: 'fr', value: 'pomme de terre' },
			},
			{},
			{},
		) );

		const wrapper = shallowMount( AllEnteredLanguages, { global: { plugins: [ store ] } } );

		expect( wrapper.findAllComponents( MonolingualFingerprintView ).length ).toBe( 1 );
		expect( wrapper.findComponent( MonolingualFingerprintView ).props( 'languageCode' ) ).toBe( 'de' );
	} );

} );
