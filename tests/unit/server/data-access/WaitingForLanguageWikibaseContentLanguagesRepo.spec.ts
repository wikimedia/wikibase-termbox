import WikibaseContentLanguagesRepo, {
	WikibaseApiContentLanguages,
} from '@/server/data-access/WikibaseContentLanguagesRepo';
import WaitingForLanguageWikibaseContentLanguagesRepo
	from '@/server/data-access/WaitingForLanguageWikibaseContentLanguagesRepo';

function newWaitingForLanguageWikibaseContentLanguagesRepo( contentLanguagesRepo: any ) {
	return new WaitingForLanguageWikibaseContentLanguagesRepo(
		contentLanguagesRepo,
	);
}

describe( 'WaitingForLanguageWikibaseContentLanguagesRepo', () => {

	it( 'can be constructed with WikibaseContentLanguagesRepo', () => {
		expect( newWaitingForLanguageWikibaseContentLanguagesRepo( {
			getContentLanguages: jest.fn(),
		} as WikibaseContentLanguagesRepo ) ).toBeInstanceOf( WaitingForLanguageWikibaseContentLanguagesRepo );
	} );

	describe( 'getContentLanguages', () => {
		it( 'does not invoke loadingRepo on null value for language', () => {
			const inLanguage = null;

			const mockGetContentLanguages = jest.fn();
			const loadingRepo: WikibaseContentLanguagesRepo = {
				getContentLanguages: mockGetContentLanguages,
			};

			const repo = newWaitingForLanguageWikibaseContentLanguagesRepo( loadingRepo );
			const result = repo.getContentLanguages( inLanguage );

			expect( result ).toBeInstanceOf( Promise );
			expect( mockGetContentLanguages ).not.toHaveBeenCalled();
		} );

		it( 'does invoke loadingRepo with given non-null language', ( done ) => {
			const inLanguage = 'de';
			const loadingRepoResult: WikibaseApiContentLanguages = {
				en: {
					code: 'en',
					name: 'Englisch',
				},
				de: {
					code: 'de',
					name: 'Deutsch',
				},
			};

			const mockGetContentLanguages = jest.fn();
			const loadingRepo: WikibaseContentLanguagesRepo = {
				getContentLanguages: mockGetContentLanguages,
			};

			mockGetContentLanguages.mockResolvedValue( loadingRepoResult );

			const repo = newWaitingForLanguageWikibaseContentLanguagesRepo( loadingRepo );
			const result = repo.getContentLanguages( inLanguage );

			expect( result ).toBeInstanceOf( Promise );
			result.then( ( contentLanguages: WikibaseApiContentLanguages ) => {
				expect( mockGetContentLanguages ).toHaveBeenCalledWith( inLanguage );
				expect( contentLanguages ).toBe( loadingRepoResult );
				done();
			} );
		} );

		it( 'propagates loadingRepo rejections', ( done ) => {
			const inLanguage = 'de';
			const loadingRepoError = new Error( 'bad' );

			const mockGetContentLanguages = jest.fn();
			const loadingRepo: WikibaseContentLanguagesRepo = {
				getContentLanguages: mockGetContentLanguages,
			};

			mockGetContentLanguages.mockReturnValue( Promise.reject( loadingRepoError ) );

			const repo = newWaitingForLanguageWikibaseContentLanguagesRepo( loadingRepo );
			const result = repo.getContentLanguages( inLanguage );

			expect( result ).toBeInstanceOf( Promise );
			result.catch( ( reason: any ) => {
				expect( mockGetContentLanguages ).toHaveBeenCalledWith( inLanguage );
				expect( reason ).toBe( loadingRepoError );
				done();
			} );
		} );
	} );

} );
