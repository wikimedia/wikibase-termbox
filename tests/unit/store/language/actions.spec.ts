import { actions } from '@/store/language/actions';
import { LANGUAGE_INIT, ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';
import { LANGUAGE_TRANSLATION_UPDATE } from '@/store/language/mutationTypes';
import { factory } from '@/common/TermboxFactory';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageState from '@/store/language/LanguageState';

describe( 'language/actions', () => {
	describe( LANGUAGE_INIT, () => {
		it( 'does not commit anything yet, just returns a promise', ( done ) => {
			const commitMock = jest.fn();
			const context = {
				commit: commitMock,
			};
			const action = actions[ LANGUAGE_INIT ] as any; // TODO

			action( context ).then( () => {
				expect( commitMock ).not.toBeCalled();
				done();
			} );
		} );
	} );

	describe( ENSURE_AVAILABLE_IN_LANGUAGE, () => {
		it( `commits translations to ${LANGUAGE_TRANSLATION_UPDATE} on getLanguagesInLanguage lookup`, ( done ) => {
			const inLanguage = 'de';
			const translations = {
				de: {
					de: 'Deutsch',
					en: 'Englisch',
				},
			} as LanguageTranslations;
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
