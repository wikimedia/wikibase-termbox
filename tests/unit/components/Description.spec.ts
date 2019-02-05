import Description from '@/components/Description.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_ENTITY, NS_MESSAGES, NS_USER } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import Term from '@/datamodel/Term';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { MessageKeys } from '@/common/MessageKeys';
import Language from '@/datamodel/Language';

function stringToTermMap( values: { [ language: string ]: string } ) {
	const terms: { [ language: string ]: Term } = {};

	Object.entries( values ).forEach( ( [ language, value ] ) =>  {
		terms[ language ] = { language, value };
	} );

	return terms;
}

function newEntityWithDescriptions( descriptions: { [ language: string ]: string } ) {
	return new FingerprintableEntity( 'Q123', {}, stringToTermMap( descriptions ), {} );
}

const DESCRIPTION_SELECTOR = '.wikibase-termbox-fingerprint__description';

describe( 'Description', () => {

	it( 'shows the entity description in the given language', () => {
		const language = 'en';
		const description = 'hello';

		const store = createStore();
		store.commit( mutation( NS_ENTITY, ENTITY_INIT ), newEntityWithDescriptions( {
			[ language ]: description,
		} ) );

		const wrapper = shallowMount( Description, {
			propsData: { language: { code: language, directionality: 'ltr' } },
			store,
		} );

		expect( wrapper.find( DESCRIPTION_SELECTOR ).text() ).toBe( description );
	} );

	it( 'shows a missing description indicator', () => {
		const language = 'en';
		const missingDescriptionMessage = 'description missing';
		const store = createStore();
		store.commit( mutation( NS_USER, LANGUAGE_INIT ), language );
		store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
			[ language ]: { [ MessageKeys.MISSING_DESCRIPTION ]: missingDescriptionMessage },
		} );

		const wrapper = shallowMount( Description, {
			propsData: { language: { code: language, directionality: 'ltr' } },
			store,
		} );

		expect( wrapper.find( DESCRIPTION_SELECTOR ).text() ).toBe( missingDescriptionMessage );
	} );

	describe( 'directionality and language code', () => {

		it.each( [
			[ { code: 'en', directionality: 'ltr' } ],
			[ { code: 'ar', directionality: 'rtl' } ],
		] )( 'sets dir and lang attributes for %o', ( language: Language ) => {
			const store = createStore();
			store.commit( mutation( NS_ENTITY, ENTITY_INIT ), newEntityWithDescriptions( {
				[ language.code ]: 'whatevs',
			} ) );

			const $description = shallowMount( Description, { propsData: { language }, store	} ).find( DESCRIPTION_SELECTOR );

			expect( $description.attributes( 'lang' ) ).toBe( language.code );
			expect( $description.attributes( 'dir' ) ).toBe( language.directionality );
		} );

		it( 'does not add directionality markup for missing description', () => {
			const language = 'en';
			const store = createStore();
			store.commit( mutation( NS_USER, LANGUAGE_INIT ), language );

			const wrapper = shallowMount( Description, {
				propsData: { language: { code: language, directionality: 'ltr' } },
				store,
			} );

			expect( wrapper.find( DESCRIPTION_SELECTOR ).attributes( 'lang' ) ).toBeFalsy();
			expect( wrapper.find( DESCRIPTION_SELECTOR ).attributes( 'dir' ) ).toBeFalsy();
		} );

	} );

} );
