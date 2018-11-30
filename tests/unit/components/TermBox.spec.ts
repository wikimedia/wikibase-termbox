import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import TermBox from '@/components/TermBox.vue';
import store from '@/store/index';
import {
	NS_ENTITY,
	NS_USER,
	NS_LANGUAGE,
} from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { LANGUAGE_TRANSLATION_UPDATE } from '@/store/language/mutationTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import LanguageTranslations from '@/datamodel/LanguageTranslations';

const localVue = createLocalVue();
const langDe = 'Deutsch';
const labelDe  = 'All I know';
const descriptionDe = 'Jakob mag potatoes.';
const aliasesDe = [ 'Antwort auf alles', 'Ihr kennt ja nicht einmal die Frage!' ];
localVue.use( Vuex );

store.commit(
`${NS_ENTITY}/${ENTITY_INIT}`,
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
	`${NS_LANGUAGE }/${LANGUAGE_TRANSLATION_UPDATE}`,
	{
		de: {
			de: langDe,
			en: 'Englisch',
		},
		en: {
			de: 'German',
			en: 'English',
		},
	} as LanguageTranslations,
);

describe( 'TermBox.vue', () => {
	it( 'renders the language label', () => {
		store.commit( `${NS_USER}/${LANGUAGE_INIT}`, 'de' );

		const wrapper = shallowMount( TermBox, { store, localVue } );
		expect( wrapper.find( '.wikibase-termbox__language' ).text() ).toBe( langDe );
	} );

	it( 'renders random ?+ in case of unknown user-language for language labels', () => {
		store.commit( `${NS_USER}/${LANGUAGE_INIT}`, 'zh' );

		const wrapper = shallowMount( TermBox, { store, localVue } );
		// this not part of the component
		expect( wrapper.find( '.wikibase-termbox__language' ).text() ).toBe( '????' );
	} );

	it( 'renders the entity label', () => {

		store.commit( `${NS_USER}/${LANGUAGE_INIT}`, 'de' );

		const wrapper = shallowMount( TermBox, { store, localVue } );
		expect( wrapper.find( '.wikibase-termbox__label' ).text() ).toBe( labelDe );
	} );

	it( 'renders ??? in case of unknown user-language for labels', () => {
		store.commit( `${NS_USER}/${LANGUAGE_INIT}`, 'en' );

		const wrapper = shallowMount( TermBox, { store, localVue } );
		expect( wrapper.find( '.wikibase-termbox__label' ).text() ).toBe( '???' );
	} );

	it( 'renders the entity description', () => {
		store.commit( `${NS_USER}/${LANGUAGE_INIT}`, 'de' );

		const wrapper = shallowMount( TermBox, { store, localVue } );
		expect( wrapper.find( '.wikibase-termbox__description' ).text() ).toBe( descriptionDe );
	} );

	it( 'renders ?? in case of unknown user-language for descriptions', () => {
		store.commit( `${NS_USER}/${LANGUAGE_INIT}`, 'en' );

		const wrapper = shallowMount( TermBox, { store, localVue } );
		expect( wrapper.find( '.wikibase-termbox__description' ).text() ).toBe( '??' );
	} );

	it( 'renders the entity aliases', () => {
		store.commit( `${NS_USER}/${LANGUAGE_INIT}`, 'de' );
		const wrapper = shallowMount( TermBox, { store, localVue } );
		const aliases = wrapper.findAll( '.wikibase-termbox__alias' );
		expect( aliases.at( 0 ).text() ).toStrictEqual( aliasesDe[0] );
		expect( aliases.at( 1 ).text() ).toStrictEqual( aliasesDe[1] );
	} );

	it( 'renders ? in case of unknown user-language for aliases', () => {
		store.commit( `${NS_USER}/${LANGUAGE_INIT}`, 'en' );

		const wrapper = shallowMount( TermBox, { store, localVue } );
		expect( wrapper.find( '.wikibase-termbox__aliases-placeholder' ).text() ).toBe( '?' );
	} );
} );
