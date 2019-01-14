import { shallowMount } from '@vue/test-utils';
import Fingerprint from '@/components/Fingerprint.vue';
import { createStore } from '@/store';
import {
	NS_ENTITY,
	NS_USER,
	NS_LANGUAGE,
} from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { LANGUAGE_TRANSLATION_UPDATE } from '@/store/language/mutationTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import { mutation } from '@/store/util';

const languageProp = 'de';
const langDe = 'Deutsch';
const labelDe  = 'All I know';
const descriptionDe = 'Jakob mag potatoes.';
const aliasesDe = [ 'Antwort auf alles', 'Ihr kennt ja nicht einmal die Frage!' ];
const store = createStore();
const emptyStore = createStore();

describe( 'Fingerprint.vue', () => {
	store.commit( mutation( NS_USER, LANGUAGE_INIT ), 'de' );
	store.commit(
		mutation( NS_ENTITY, ENTITY_INIT ),
		new FingerprintableEntity(
			'Q42',
			{
				de: {
					language: 'de',
					value: labelDe,
				},
			},
			{
				de: {
					language: 'de',
					value: descriptionDe,
				},
			},
			{
				de: [
					{
						language: 'de',
						value: aliasesDe[0],
					},
					{
						language: 'de',
						value: aliasesDe[1],
					},
				],
			},
		),
	);

	store.commit(
		mutation( NS_LANGUAGE , LANGUAGE_TRANSLATION_UPDATE ),
		{
			de: {
				de: langDe,
				en: 'Englisch',
			},
			en: {
				de: 'German',
				en: 'English',
			},
		},
	);

	it( 'renders the component with primarayLanguage as modifier if isPrimary flag is true', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					isPrimary: true,
					language: languageProp,
				},
			},
		);
		expect( wrapper.classes( 'wikibase-termbox-fingerprint--primaryLanguage' ) ).toBeTruthy();
	} );

	it( 'renders the component with no modifier if isPrimary flag is false', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					isPrimary: false,
					language: languageProp,
				},
			},
		);
		expect( wrapper.classes() ).toEqual( [ 'wikibase-termbox-fingerprint' ] );
	} );

	it( 'renders the component with no modifier if isPrimary flag is not set', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					language: languageProp,
				},
			},
		);
		expect( wrapper.classes() ).toEqual( [ 'wikibase-termbox-fingerprint' ] );
	} );

	it( 'renders the name of current language', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					language: languageProp,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__language' ).text() ).toBe( langDe );
	} );

	it( 'renders random ?+ in case of unknown language name', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store: emptyStore,
				propsData: {
					language: languageProp,
				},
			},
		);
		// this not part of the component
		expect( wrapper.find( '.wikibase-termbox-fingerprint__language' ).text() ).toBe( '????' );
	} );

	it( 'renders the entity label', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					language: languageProp,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__label' ).text() ).toBe( labelDe );
	} );

	it( 'renders ??? in case of unknown user-language for labels', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store: emptyStore,
				propsData: {
					language: languageProp,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__label' ).text() ).toBe( '???' );
	} );

	it( 'renders the entity description', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					language: languageProp,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__description' ).text() ).toBe( descriptionDe );
	} );

	it( 'renders ?? in case of unknown user-language for descriptions', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store: emptyStore,
				propsData: {
					language: languageProp,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__description' ).text() ).toBe( '??' );
	} );

	it( 'renders the entity aliases', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					language: languageProp,
				},
			},
		);
		const aliases = wrapper.findAll( '.wikibase-termbox-fingerprint__alias' );
		expect( aliases.at( 0 ).text() ).toStrictEqual( aliasesDe[0] );
		expect( aliases.at( 1 ).text() ).toStrictEqual( aliasesDe[1] );
	} );

	it( 'renders ? in case of unknown user-language for aliases', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store: emptyStore,
				propsData: {
					language: languageProp,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__aliases--placeholder' ).text() ).toBe( '?' );
	} );
} );
