import { getters } from '@/store/language/getters';
import LanguageState from '@/store/language/LanguageState';

function newMinimalStore(): LanguageState {
	return {
		languages: {
			de: {
				code: 'de',
				directionality: 'ltr',
			},
		},
		translations: {
			de: {
				de: 'Deutsch',
				en: 'Englisch',
			},
			en: {
				de: 'German',
				en: 'English',
			},
		},
	} as LanguageState;
}

describe( 'language/Getters', () => {

	describe( 'getByCode', () => {
		it( 'returns matching language if found', () => {
			const store = newMinimalStore();
			expect( getters.getByCode( store, null, null, null )( 'de' ) )
				.toBe( store.languages.de );
		} );

		it( 'returns null if not found', () => {
			expect( getters.getByCode( newMinimalStore(), null, null, null )( 'ru' ) )
				.toBeNull();
		} );
	} );

	describe( 'getTranslationByCode', () => {
		it( 'returns matching translation if found', () => {
			expect( getters.getTranslationByCode( newMinimalStore(), getters, null, null )( 'de', 'en' ) )
				.toBe( 'German' );
			expect( getters.getTranslationByCode( newMinimalStore(), getters, null, null )( 'en', 'de' ) )
				.toBe( 'Englisch' );
		} );

		// TODO is this the right behavior anyway?
		it( 'returns null if language not found', () => {
			expect( getters.getTranslationByCode( newMinimalStore(), getters, null, null )( 'ru', 'de' ) )
				.toBeNull();
		} );

		it( 'returns null if translation not found', () => {
			expect( getters.getTranslationByCode( newMinimalStore(), getters, null, null )( 'de', 'ru' ) )
				.toBeNull();
		} );
	} );

} );
