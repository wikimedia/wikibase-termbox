import { actions } from '@/store/language/actions';
import { ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';
import { LANGUAGE_TRANSLATION_UPDATE } from '../../../../src/store/language/mutationTypes';
import { factory } from '@/common/TermboxFactory';
import LanguageTranslations from '../../../../src/datamodel/LanguageTranslations';
import LanguageState from '../../../../src/store/language/LanguageState';

function newMinimalStore( fields: any ): LanguageState {
	return {
		languages: {},
		translations: {},
		...fields,
	} as LanguageState;
}

describe( 'language/actions', () => {
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
			const context = newMinimalStore( {
				commit: commitMock,
			} );
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
