import { shallowMount } from '@vue/test-utils';
import AllEnteredLanguages from '@/components/AllEnteredLanguages.vue';
import Fingerprint from '@/components/Fingerprint.vue';
import { createStore } from '@/store';
import {
	NS_USER,
} from '@/store/namespaces';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { mutation } from '@/store/util';
import { NS_ENTITY } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

describe( 'AllEnteredLanguages', () => {

	it( 'passes language prop to Fingerprint', () => {
		const language = 'de';
		const store = createStore();
		store.commit( mutation( NS_ENTITY, ENTITY_INIT ), new FingerprintableEntity(
			'Q42',
			{ [ language ]: { language, value: 'kartoffel' } },
			{},
			{},
		) );

		const wrapper = shallowMount( AllEnteredLanguages, { store } );

		expect( wrapper.find( Fingerprint ).props( 'language' ) ).toBe( language );
	} );

	it( 'does not contain the primary user language', () => {
		const store = createStore();
		store.commit( mutation( NS_USER, LANGUAGE_INIT ), 'de' );

		store.commit( mutation( NS_ENTITY, ENTITY_INIT ), new FingerprintableEntity(
			'Q42',
			{
				de: { language: 'de', value: 'kartoffel' },
				en: { language: 'en', value: 'potato' },
			},
			{},
			{},
		) );

		const wrapper = shallowMount( AllEnteredLanguages, { store } );

		expect( wrapper.findAll( Fingerprint ).length ).toBe( 1 );
		expect( wrapper.find( Fingerprint ).props( 'language' ) ).toBe( 'en' );
	} );

} );
