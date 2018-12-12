import LanguageCollection from '@/datamodel/LanguageCollection';
import MwBotWikibaseContentLanguagesRepo from '@/server/data-access/MwBotWikibaseContentLanguagesRepo';
import mwbot from 'mwbot';
import ContentLanguagesLanguageRepo from '@/server/data-access/ContentLanguagesLanguageRepo';
import { WikibaseApiContentLanguages } from '@/server/data-access/WikibaseContentLanguagesRepo';
import RtlDetectLib from 'rtl-detect';

function newWikibaseContentLanguagesRepository( contentLanguagesRepo: any ) {
	return new ContentLanguagesLanguageRepo(
		contentLanguagesRepo,
	);
}

describe( 'ContentLanguagesLanguageRepo', () => {

	it( 'can be constructed with MwBotWikibaseContentLanguagesRepo', () => {
		expect( newWikibaseContentLanguagesRepository( new MwBotWikibaseContentLanguagesRepo( {} as mwbot ) ) )
			.toBeInstanceOf( ContentLanguagesLanguageRepo );
	} );

	describe( 'getLanguages', () => {
		it( 'resolves to languages on success', ( done ) => {
			const getContentLanguages = jest.fn();
			getContentLanguages.mockResolvedValue( {
				en: {
					code: 'en',
					name: 'English',
				},
				ar: {
					code: 'ar',
					name: 'Arabic',
				},
			} as WikibaseApiContentLanguages );
			const contentLanguagesRepo = {
				getContentLanguages,
			};

			const repo = newWikibaseContentLanguagesRepository( contentLanguagesRepo );

			repo.getLanguages().then( ( languages: LanguageCollection ) => {
				expect( languages ).toEqual( {
					en: {
						code: 'en',
						directionality: 'ltr',
					},
					ar: {
						code: 'ar',
						directionality: 'rtl',
					},
				} as LanguageCollection );
				done();
			} );
		} );

		it( 'loads language directionality from rtl-detect', ( done ) => {
			const spyGetLangDir = jest.spyOn( RtlDetectLib, 'getLangDir' );

			const getContentLanguages = jest.fn();
			getContentLanguages.mockResolvedValue( {
				en: {
					code: 'en',
					name: 'English',
				},
				ar: {
					code: 'ar',
					name: 'Arabic',
				},
			} as WikibaseApiContentLanguages );
			const contentLanguagesRepo = {
				getContentLanguages,
			};
			const repo = newWikibaseContentLanguagesRepository( contentLanguagesRepo );

			repo.getLanguages().then( ( languages: LanguageCollection ) => {
				expect( spyGetLangDir ).toBeCalledTimes( 2 );
				expect( spyGetLangDir ).toBeCalledWith( 'en' );
				expect( spyGetLangDir ).toBeCalledWith( 'ar' );
				done();
			} );
		} );

	} );

} );
