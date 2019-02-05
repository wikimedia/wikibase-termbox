import Label from '@/components/Label.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_ENTITY } from '@/store/namespaces';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import Term from '@/datamodel/Term';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import { NS_MESSAGES, NS_USER } from '@/store/namespaces';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { MessageKeys } from '@/common/MessageKeys';
import Language from '@/datamodel/Language';

const LABEL_SELECTOR = '.wikibase-termbox-fingerprint__label';

function stringToTermMap( values: { [ language: string ]: string } ) {
	const terms: { [ language: string ]: Term } = {};

	Object.entries( values ).forEach( ( [ language, value ] ) =>  {
		terms[ language ] = { language, value };
	} );

	return terms;
}

function newEntityWithLabels( labels: { [ language: string ]: string } ) {
	return new FingerprintableEntity( 'Q123', stringToTermMap( labels ), {}, {} );
}

describe( 'Label', () => {

	it( 'shows the entity label in the given language', () => {
		const language = 'en';
		const label = 'hello';

		const store = createStore();
		store.commit( mutation( NS_ENTITY, ENTITY_INIT ), newEntityWithLabels( {
			[ language ]: label,
		} ) );

		const wrapper = shallowMount( Label, {
			propsData: { language: { code: language, directionality: 'ltr' } },
			store,
		} );

		expect( wrapper.find( LABEL_SELECTOR ).text() ).toBe( label );
	} );

	it( 'shows a missing label indicator', () => {
		const language = 'en';
		const missingLabelMessage = 'label missing';
		const store = createStore();
		store.commit( mutation( NS_USER, LANGUAGE_INIT ), language );
		store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
			[ language ]: { [ MessageKeys.MISSING_LABEL ]: missingLabelMessage },
		} );

		const wrapper = shallowMount( Label, {
			propsData: { language: { code: language, directionality: 'ltr' } },
			store,
		} );

		expect( wrapper.find( LABEL_SELECTOR ).text() ).toBe( missingLabelMessage );
	} );

	describe( 'directionality and language code', () => {

		it.each( [
			[ { code: 'en', directionality: 'ltr' } ],
			[ { code: 'ar', directionality: 'rtl' } ],
		] )( 'sets dir and lang attributes for %o', ( language: Language ) => {
			const store = createStore();
			store.commit( mutation( NS_ENTITY, ENTITY_INIT ), newEntityWithLabels( {
				[ language.code ]: 'whatevs',
			} ) );

			const $label = shallowMount( Label, { propsData: { language }, store	} ).find( LABEL_SELECTOR );

			expect( $label.attributes( 'lang' ) ).toBe( language.code );
			expect( $label.attributes( 'dir' ) ).toBe( language.directionality );
		} );

		it( 'does not add directionality markup for missing labels', () => {
			const language = 'en';
			const store = createStore();
			store.commit( mutation( NS_USER, LANGUAGE_INIT ), language );

			const wrapper = shallowMount( Label, {
				propsData: { language: { code: language, directionality: 'ltr' } },
				store,
			} );

			expect( wrapper.find( LABEL_SELECTOR ).attributes( 'lang' ) ).toBeFalsy();
			expect( wrapper.find( LABEL_SELECTOR ).attributes( 'dir' ) ).toBeFalsy();
		} );

	} );

	it( 'renders the label as a heading if it is the primary language', () => {
		const language = 'en';
		const store = createStore();
		store.commit( mutation( NS_ENTITY, ENTITY_INIT ), newEntityWithLabels( {
			[ language ]: 'hello',
		} ) );

		const wrapper = shallowMount( Label, {
			propsData: { isPrimary: true, language: { code: 'en', directionality: 'ltr' } },
			store,
		} );
		expect( wrapper.find( '.wikibase-termbox-fingerprint__label' ).element.tagName ).toBe( 'H2' );
	} );

} );
