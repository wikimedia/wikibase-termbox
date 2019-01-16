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

const userLanguageCode = 'de';

const languageCodeDe = 'de';

const languageNameDeInDe = 'Deutsch';

const entityLabelDe  = 'All I know';
const entityDescriptionDe = 'Jakob mag potatoes.';
const entityAliasesDe = [ 'Antwort auf alles', 'Ihr kennt ja nicht einmal die Frage!' ];

const languageCodeWithoutDataInEntity = 'en';

const store = createStore();

describe( 'Fingerprint.vue', () => {
	store.commit( mutation( NS_USER, LANGUAGE_INIT ), userLanguageCode );
	store.commit(
		mutation( NS_ENTITY, ENTITY_INIT ),
		new FingerprintableEntity(
			'Q42',
			{
				de: {
					language: 'de',
					value: entityLabelDe,
				},
			},
			{
				de: {
					language: 'de',
					value: entityDescriptionDe,
				},
			},
			{
				de: [
					{
						language: 'de',
						value: entityAliasesDe[0],
					},
					{
						language: 'de',
						value: entityAliasesDe[1],
					},
				],
			},
		),
	);

	store.commit(
		mutation( NS_LANGUAGE , LANGUAGE_TRANSLATION_UPDATE ),
		{
			de: {
				de: languageNameDeInDe,
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
					language: languageCodeDe,
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
					language: languageCodeDe,
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
					language: languageCodeDe,
				},
			},
		);
		expect( wrapper.classes() ).toEqual( [ 'wikibase-termbox-fingerprint' ] );
	} );

	it( 'renders the translation of the name of the language in user language', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					language: languageCodeDe,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__language' ).text() ).toBe( languageNameDeInDe );
	} );

	it( 'renders ???? in case of missing language name translation in user language', () => {
		const languageCodeWithUntranslatedName = 'fr';
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					language: languageCodeWithUntranslatedName,
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
					language: languageCodeDe,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__label' ).text() ).toBe( entityLabelDe );
	} );

	it( 'renders ??? in case entity does not have a label in language', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					language: languageCodeWithoutDataInEntity,
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
					language: languageCodeDe,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__description' ).text() ).toBe( entityDescriptionDe );
	} );

	it( 'renders ?? in case entity does not have a description in language', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					language: languageCodeWithoutDataInEntity,
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
					language: languageCodeDe,
				},
			},
		);
		const aliases = wrapper.findAll( '.wikibase-termbox-fingerprint__alias' );
		expect( aliases.at( 0 ).text() ).toStrictEqual( entityAliasesDe[0] );
		expect( aliases.at( 1 ).text() ).toStrictEqual( entityAliasesDe[1] );
	} );

	it( 'renders ? in case entity does not have aliases in language', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					language: languageCodeWithoutDataInEntity,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__aliases--placeholder' ).text() ).toBe( '?' );
	} );
} );
