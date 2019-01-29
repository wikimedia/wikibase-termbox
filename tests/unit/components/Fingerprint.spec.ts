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
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { NS_MESSAGES, NS_USER } from '@/store/namespaces';
import { MessageKeys } from '@/common/MessageKeys';

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

	it( 'renders the component with label heading and primaryLanguage as modifier if isPrimary flag is true', () => {
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
		expect( wrapper.find( '.wikibase-termbox-fingerprint__label' ).element.tagName ).toBe( 'H2' );
	} );

	it( 'renders the component with no modifier and no heading if isPrimary flag is false', () => {
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
		expect( wrapper.find( '.wikibase-termbox-fingerprint__label' ).element.tagName ).toBe( 'DIV' );
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

	it( 'renders "missing label" message in case entity does not have a label in language', () => {
		const missingLabelMessage = 'label missing';
		const userLanguage = 'en';

		store.commit( mutation( NS_USER, LANGUAGE_INIT ), userLanguage );
		store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
			[ userLanguage ]: {
				[ MessageKeys.MISSING_LABEL ]: missingLabelMessage,
			},
		} );

		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					languageCode: languageCodeWithoutDataInEntity,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__label' ).text() ).toBe( missingLabelMessage );
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

	it( 'renders "missing description" message in case entity does not have a description in language', () => {
		const missingDescriptionMessage = 'description missing';
		const userLanguage = 'en';

		store.commit( mutation( NS_USER, LANGUAGE_INIT ), userLanguage );
		store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
			[ userLanguage ]: {
				[ MessageKeys.MISSING_DESCRIPTION ]: missingDescriptionMessage,
			},
		} );

		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					languageCode: languageCodeWithoutDataInEntity,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__description' ).text() ).toBe( missingDescriptionMessage );
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

	it( 'renders a visible field with no text in case entity does not have aliases in language', () => {
		const wrapper = shallowMount(
			Fingerprint,
			{
				store,
				propsData: {
					languageCode: languageCodeWithoutDataInEntity,
				},
			},
		);
		expect( wrapper.find( '.wikibase-termbox-fingerprint__aliases--placeholder' ).isEmpty() ).toBeTruthy();
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
