import { actions } from '@/store/language/actions';
import { LANGUAGE_INIT, ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';
import {
	LANGUAGE_TRANSLATION_UPDATE,
	LANGUAGE_UPDATE,
} from '@/store/language/mutationTypes';
import { factory } from '@/common/TermboxFactory';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageCollection from '@/datamodel/LanguageCollection';

describe( 'language/actions', () => {
	describe( LANGUAGE_INIT, () => {
		it( 'commits a fixed set of languages and returns a resolved promise', ( done ) => {
			const languages: LanguageCollection = {
				en: {
					code: 'en',
					directionality: 'ltr',
				},
				de: {
					code: 'de',
					directionality: 'ltr',
				},
				ar: {
					code: 'ar',
					directionality: 'rtl',
				},
			};
			const getLanguagesMock = jest.fn();
			getLanguagesMock.mockResolvedValue( languages );
			factory.setLanguageRepository( {
				getLanguages: getLanguagesMock,
			} );
			const commitMock = jest.fn();
			const context = {
				commit: commitMock,
			};
			const action = actions[ LANGUAGE_INIT ] as any; // TODO

			action( context ).then( () => {
				expect( commitMock ).toBeCalledWith(
					LANGUAGE_UPDATE,
					languages,
				);
				done();
			} );
		} );
	} );

	describe( ENSURE_AVAILABLE_IN_LANGUAGE, () => {
		it( `commits translations to ${LANGUAGE_TRANSLATION_UPDATE} on getLanguagesInLanguage lookup`, ( done ) => {
			const inLanguage = 'de';
			const translations: LanguageTranslations = {
				de: {
					de: 'Deutsch',
					en: 'Englisch',
				},
			};
			factory.setLanguageTranslationRepository( {
				getLanguagesInLanguage: ( thisInLanguage: string ) => {
					expect( thisInLanguage ).toBe( inLanguage );
					return Promise.resolve( translations );
				},
			} );
			const commitMock = jest.fn();
			const context = {
				commit: commitMock,
			};
			const action = actions[ ENSURE_AVAILABLE_IN_LANGUAGE ] as any; // TODO

			action( context, inLanguage ).then( () => {
				expect( commitMock ).toBeCalledWith(
					LANGUAGE_TRANSLATION_UPDATE,
					translations,
				);
				done();
			} );
		} );
	} );
} );
