import { mutations } from '@/store/language/mutations';
import {
	LANGUAGE_TRANSLATION_UPDATE,
	LANGUAGE_UPDATE,
} from '@/store/language/mutationTypes';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageState from '@/store/language/LanguageState';
import LanguageCollection from '@/datamodel/LanguageCollection';

function newMinimalStore(): LanguageState {
	return {
		translations: {},
		languages: {},
	};
}

describe( 'language/mutations', () => {
	describe( LANGUAGE_UPDATE, () => {
		it( 'contains languages after initialization', () => {
			const store = newMinimalStore();
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

			mutations[ LANGUAGE_UPDATE ]( store, languages );

			expect( store.languages.de ).toBe( languages.de );
			expect( store.languages.en ).toBe( languages.en );
		} );

		it( 'appends new languages to pre-existing ones', () => {
			const store = newMinimalStore();
			const originalDe = {
				code: 'de',
				directionality: 'ltr',
			};
			store.languages.de = originalDe;
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

			mutations[ LANGUAGE_UPDATE ]( store, languages );

			expect( store.languages.de ).toBe( originalDe );
			expect( store.languages.en ).toBe( languages.en );
			expect( store.languages.ar ).toBe( languages.ar );
		} );
	} );

	describe( LANGUAGE_TRANSLATION_UPDATE, () => {
		// TODO
		/*
		it.skip( 'throws an error if an invalid object is given', () => {
			expect( () => {
				mutations[ LANGUAGE_TRANSLATION_UPDATE ]( newMinimalStore(), '' );
			} ).toThrow( InvalidEntityException );

			expect( () => {
				mutations[ LANGUAGE_TRANSLATION_UPDATE ]( newMinimalStore(), [] );
			} ).toThrow( InvalidEntityException );

			expect( () => {
				mutations[ LANGUAGE_TRANSLATION_UPDATE ]( newMinimalStore(), { id: 'whatever' } );
			} ).toThrow( InvalidEntityException );
		} );
		*/

		it( 'contains entity data after initialization', () => {
			const store = newMinimalStore();
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

			mutations[ LANGUAGE_TRANSLATION_UPDATE ]( store, translations );

			expect( store.translations.de ).toBe( translations.de );
			expect( store.translations.ar ).toBe( translations.ar );
		} );
	} );
} );
