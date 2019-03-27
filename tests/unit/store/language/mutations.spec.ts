import { mutations } from '@/store/language/mutations';
import {
	LANGUAGE_TRANSLATION_UPDATE,
	LANGUAGE_UPDATE,
} from '@/store/language/mutationTypes';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageState from '@/store/language/LanguageState';
import LanguageCollection from '@/datamodel/LanguageCollection';

function newLanguageState(): LanguageState {
	return {
		translations: {},
		languages: {},
	};
}

describe( 'language/mutations', () => {
	describe( LANGUAGE_UPDATE, () => {
		it( 'contains languages after initialization', () => {
			const state = newLanguageState();
			const languages: LanguageCollection = {
				de: {
					code: 'de',
					directionality: 'ltr',
				},
				en: {
					code: 'en',
					directionality: 'ltr',
				},
			};

			mutations[ LANGUAGE_UPDATE ]( state, languages );

			expect( state.languages.de ).toBe( languages.de );
			expect( state.languages.en ).toBe( languages.en );
		} );

		it( 'appends new languages to pre-existing ones', () => {
			const state = newLanguageState();
			const originalDe = {
				code: 'de',
				directionality: 'ltr',
			};
			state.languages.de = originalDe;
			const languages: LanguageCollection = {
				en: {
					code: 'en',
					directionality: 'ltr',
				},
				ar: {
					code: 'ar',
					directionality: 'rtl',
				},
			};

			mutations[ LANGUAGE_UPDATE ]( state, languages );

			expect( state.languages.de ).toBe( originalDe );
			expect( state.languages.en ).toBe( languages.en );
			expect( state.languages.ar ).toBe( languages.ar );
		} );
	} );

	describe( LANGUAGE_TRANSLATION_UPDATE, () => {
		// TODO
		/*
		it.skip( 'throws an error if an invalid object is given', () => {
			expect( () => {
				mutations[ LANGUAGE_TRANSLATION_UPDATE ]( newMockStore(), '' );
			} ).toThrow( InvalidEntityException );

			expect( () => {
				mutations[ LANGUAGE_TRANSLATION_UPDATE ]( newMockStore(), [] );
			} ).toThrow( InvalidEntityException );

			expect( () => {
				mutations[ LANGUAGE_TRANSLATION_UPDATE ]( newMockStore(), { id: 'whatever' } );
			} ).toThrow( InvalidEntityException );
		} );
		*/

		it( 'contains entity data after initialization', () => {
			const state = newLanguageState();
			const translations: LanguageTranslations = {
				de: {
					de: 'Deutsch',
					en: 'Englisch',
				},
				en: {
					de: 'German',
					en: 'English',
				},
			};

			mutations[ LANGUAGE_TRANSLATION_UPDATE ]( state, translations );

			expect( state.translations.de ).toBe( translations.de );
			expect( state.translations.ar ).toBe( translations.ar );
		} );
	} );
} );
