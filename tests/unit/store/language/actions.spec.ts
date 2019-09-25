import actions from '@/store/language/actions';
import { LANGUAGE_INIT, ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';
import {
	LANGUAGE_TRANSLATION_UPDATE,
	LANGUAGE_UPDATE,
} from '@/store/language/mutationTypes';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageCollection from '@/datamodel/LanguageCollection';
import newMockStore from '@wmde/vuex-helpers/dist/newMockStore';

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
			const languageRepository = {
				getLanguages: getLanguagesMock,
			};
			const commitMock = jest.fn();
			const context = newMockStore( {
				commit: commitMock,
			} );

			actions(
				languageRepository,
				{ getLanguagesInLanguage: jest.fn() },
			)[ LANGUAGE_INIT ]( context ).then( () => {
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
			const languageTranslationRepository = {
				getLanguagesInLanguage: ( thisInLanguage: string ) => {
					expect( thisInLanguage ).toBe( inLanguage );
					return Promise.resolve( translations );
				},
			};
			const commitMock = jest.fn();
			const context = newMockStore( {
				commit: commitMock,
			} );

			actions(
				{ getLanguages: jest.fn() },
				languageTranslationRepository,
			)[ ENSURE_AVAILABLE_IN_LANGUAGE ]( context, inLanguage ).then( () => {
				expect( commitMock ).toBeCalledWith(
					LANGUAGE_TRANSLATION_UPDATE,
					translations,
				);
				done();
			} );
		} );
	} );
} );
