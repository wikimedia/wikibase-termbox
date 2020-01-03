import LanguageTranslations from '@/datamodel/LanguageTranslations';
import ContentLanguagesLanguageTranslationRepo from '@/server/data-access/ContentLanguagesLanguageTranslationRepo';
import { WikibaseApiContentLanguages } from '@/server/data-access/WikibaseContentLanguagesRepo';
import WikibaseContentLanguagesRepo from '@/server/data-access/WikibaseContentLanguagesRepo';

function newWikibaseContentLanguagesRepository( contentLanguagesRepo: any ) {
	return new ContentLanguagesLanguageTranslationRepo(
		contentLanguagesRepo,
	);
}

describe( 'ContentLanguagesLanguageTranslationRepo', () => {

	it( 'can be constructed with WikibaseContentLanguagesRepo', () => {
		expect( newWikibaseContentLanguagesRepository( {
			getContentLanguages: jest.fn(),
		} as WikibaseContentLanguagesRepo ) ).toBeInstanceOf( ContentLanguagesLanguageTranslationRepo );
	} );

	describe( 'getLanguagesInLanguage', () => {
		it( 'resolves to language names on success', () => {
			const inLanguage = 'de';
			const languages: WikibaseApiContentLanguages = {
				en: {
					code: 'en',
					name: 'Englisch',
				},
				de: {
					code: 'de',
					name: 'Deutsch',
				},
			};
			const getContentLanguages = jest.fn();
			getContentLanguages.mockResolvedValue( languages );
			const contentLanguagesRepo = {
				getContentLanguages,
			};

			const repo = newWikibaseContentLanguagesRepository( contentLanguagesRepo );
			return repo.getLanguagesInLanguage( inLanguage ).then( ( languageTranslations: LanguageTranslations ) => {
				expect( getContentLanguages ).toBeCalledWith( inLanguage );
				expect( languageTranslations ).toEqual( {
					[ inLanguage ]: {
						en: 'Englisch',
						de: 'Deutsch',
					},
				} );
			} );
		} );
	} );

} );
