import { shallowMount } from '@vue/test-utils';
import Fingerprint from '@/components/Fingerprint.vue';
import LanguageNameInUserLanguage from '@/components/LanguageNameInUserLanguage.vue';
import { createStore } from '@/store';
import {
	NS_ENTITY,
	NS_LANGUAGE,
} from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import { mutation } from '@/store/util';
import Language from '@/datamodel/Language';

const languageCodeAr = 'ar';
const languageCodeDe = 'de';

const entityLabelDe  = 'All I know';
const entityDescriptionDe = 'Jakob mag potatoes.';
const entityAliasesDe = [ 'Antwort auf alles', 'Ihr kennt ja nicht einmal die Frage!' ];

const languageCodeWithoutDataInEntity = 'en';

const languageAr: Language = { code: languageCodeAr, directionality: 'rtl' };
const languageDe: Language = { code: languageCodeDe, directionality: 'ltr' };

const store = createStore();

describe( 'Fingerprint.vue', () => {
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
				ar: [ { language: 'ar', value: 'برلين ألمانيا' } ],
			},
		),
	);

	store.commit(
		mutation( NS_LANGUAGE, LANGUAGE_UPDATE ),
		{
			ar: languageAr,
			de: languageDe,
			en: {
				code: 'en',
				directionality: 'ltr',
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
					languageCode: languageCodeDe,
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
					languageCode: languageCodeDe,
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
					languageCode: languageCodeDe,
				},
			},
		);
		expect( wrapper.classes() ).toEqual( [ 'wikibase-termbox-fingerprint' ] );
	} );

	it( 'delegates the translation of the name of the language to LanguageNameInUserLanguage', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					languageCode: languageCodeDe,
				},
			},
		);

		const languageNameInUserLanguage = wrapper.find( '.wikibase-termbox-fingerprint__language' );

		expect( languageNameInUserLanguage.is( LanguageNameInUserLanguage ) ).toBeTruthy();
		expect( languageNameInUserLanguage.props( 'language' ) ).toBe( languageDe );
	} );

	it( 'renders the entity label', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					languageCode: languageCodeDe,
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
					languageCode: languageCodeWithoutDataInEntity,
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
					languageCode: languageCodeDe,
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
					languageCode: languageCodeWithoutDataInEntity,
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
					languageCode: languageCodeDe,
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
					languageCode: languageCodeWithoutDataInEntity,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__aliases--placeholder' ).text() ).toBe( '?' );
	} );

	it( 'marks-up the elements of the fingerprint with the language code and directionality', () => {
		const wrapper = shallowMount( Fingerprint, { store, propsData: { languageCode: languageCodeAr } } );
		const $label = wrapper.find( '.wikibase-termbox-fingerprint__label' );
		const $description = wrapper.find( '.wikibase-termbox-fingerprint__description' );
		const $aliases = wrapper.find( '.wikibase-termbox-fingerprint__aliases' );

		expect( $label.attributes( 'lang' ) ).toBe( languageAr.code );
		expect( $label.attributes( 'dir' ) ).toBe( languageAr.directionality );

		expect( $description.attributes( 'lang' ) ).toBe( languageAr.code );
		expect( $description.attributes( 'dir' ) ).toBe( languageAr.directionality );

		expect( $aliases.attributes( 'lang' ) ).toBe( languageAr.code );
		expect( $aliases.attributes( 'dir' ) ).toBe( languageAr.directionality );
	} );
} );
