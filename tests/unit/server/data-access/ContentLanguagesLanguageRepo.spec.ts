import LanguageCollection from '@/datamodel/LanguageCollection';
import ContentLanguagesLanguageRepo from '@/server/data-access/ContentLanguagesLanguageRepo';
import RtlDetectLib from 'rtl-detect';
import WikibaseContentLanguagesRepo from '@/server/data-access/WikibaseContentLanguagesRepo';

function newWikibaseContentLanguagesRepository( contentLanguagesRepo: any ) {
	return new ContentLanguagesLanguageRepo(
		contentLanguagesRepo,
	);
}

describe( 'ContentLanguagesLanguageRepo', () => {

	it( 'can be constructed with a WikibaseContentLanguagesRepo', () => {
		expect( newWikibaseContentLanguagesRepository( {
			getContentLanguages: jest.fn(),
		} as WikibaseContentLanguagesRepo ) ).toBeInstanceOf( ContentLanguagesLanguageRepo );
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
			} );
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
				} );
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
			} );
			const contentLanguagesRepo = {
				getContentLanguages,
			};
			const repo = newWikibaseContentLanguagesRepository( contentLanguagesRepo );

			repo.getLanguages().then( () => {
				expect( spyGetLangDir ).toBeCalledTimes( 2 );
				expect( spyGetLangDir ).toBeCalledWith( 'en' );
				expect( spyGetLangDir ).toBeCalledWith( 'ar' );
				done();
			} );
		} );

	} );

} );
