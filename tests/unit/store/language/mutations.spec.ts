import { mutations } from '@/store/language/mutations';
import {
	LANGUAGE_TRANSLATION_UPDATE,
} from '@/store/language/mutationTypes';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageState from '../../../../src/store/language/LanguageState';

function newMinimalStore(): LanguageState {
	return {
		translations: {},
		languages: {},
	} as LanguageState;
}

describe( 'language/mutations', () => {
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
			const translations = {
				de: {
					de: 'Deutsch',
					en: 'Englisch',
				},
				en: {
					de: 'German',
					en: 'English',
				},
			} as LanguageTranslations;

			mutations[ LANGUAGE_TRANSLATION_UPDATE ]( store, translations );

			expect( store.translations.de ).toBe( translations.de );
			expect( store.translations.ar ).toBe( translations.ar );
		} );
	} );
} );
