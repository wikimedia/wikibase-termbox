import { getters } from '@/store/language/getters';
import LanguageState from '@/store/language/LanguageState';
import { NS_USER } from '@/store/namespaces';

function newMinimalStore(): LanguageState {
	return {
		languages: {
			de: {
				code: 'de',
				directionality: 'ltr',
			},
			en: {
				code: 'en',
				directionality: 'ltr',
			},
		},
		translations: {
			de: {
				de: 'Deutsch',
				// en: 'Englisch', // intentionally missing to tests fallback to language code
			},
			en: {
				de: 'German',
				en: 'English',
			},
		},
	};
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

	describe( 'getTranslationInUserLanguage', () => {
		it( 'returns matching translation if found', () => {
			const store = newMinimalStore();
			const rootStore = {
				[ NS_USER ]: {
					'primaryLanguage': 'en',
				},
			};
			expect( getters.getTranslationInUserLanguage( store, getters, rootStore, null )( store.languages.de.code ) )
				.toBe( store.translations.en.de );
		} );

		// in actuality the two following scenarios should never happen

		it( 'returns language code if there are no translations (at all) in user language', () => {
			const store = newMinimalStore();
			const rootStore = {
				[ NS_USER ]: {
					'primaryLanguage': 'ru',
				},
			};
			expect( getters.getTranslationInUserLanguage( store, getters, rootStore, null )( store.languages.de.code ) )
				.toBe( store.languages.de.code );
		} );

		it( 'returns language code if there is no translation (for this language) in user language', () => {
			const store = newMinimalStore();
			const rootStore = {
				[ NS_USER ]: {
					'primaryLanguage': 'de',
				},
			};
			expect( getters.getTranslationInUserLanguage( store, getters, rootStore, null )( store.languages.en.code ) )
				.toBe( store.languages.en.code );
		} );
	} );
} );
