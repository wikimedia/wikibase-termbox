import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import LanguageTranslations from '@/datamodel/LanguageTranslations';
import MwBotWikibaseContentLanguagesRepo from '@/server/data-access/MwBotWikibaseContentLanguagesRepo';
import mwbot from 'mwbot';
import ContentLanguagesLanguageTranslationRepo from '@/server/data-access/ContentLanguagesLanguageTranslationRepo';
import { WikibaseApiContentLanguages } from '@/server/data-access/WikibaseContentLanguagesRepo';

function newWikibaseContentLanguagesRepository( contentLanguagesRepo: any ) {
	return new ContentLanguagesLanguageTranslationRepo(
		contentLanguagesRepo,
	);
}

describe( 'ContentLanguagesLanguageTranslationRepo', () => {

	it( 'can be constructed with MwBotWikibaseContentLanguagesRepo', () => {
		expect( newWikibaseContentLanguagesRepository( new MwBotWikibaseContentLanguagesRepo( {} as mwbot ) ) )
			.toBeInstanceOf( ContentLanguagesLanguageTranslationRepo );
	} );

	describe( 'getLanguagesInLanguage', () => {
		it( 'resolves to language names on success', ( done ) => {
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
			repo.getLanguagesInLanguage( inLanguage ).then( ( languageTranslations: LanguageTranslations ) => {
				expect( getContentLanguages ).toBeCalledWith( inLanguage );
				expect( languageTranslations ).toEqual( {
					[ inLanguage ]: {
						en: 'Englisch',
						de: 'Deutsch',
					},
				} );
				done();
			} );
		} );

		it( 'rejects in case a found language lacks the name property', ( done ) => {
			const inLanguage = 'de';
			const language = {
				code: 'en',
			};
			const languages = {
				en: language,
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
			repo.getLanguagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'Name for a language not given.' );
				done();
			} );
		} );
	} );

} );
