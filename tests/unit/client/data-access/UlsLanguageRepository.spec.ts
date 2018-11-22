import UlsLanguageTranslationRepository from '@/client/data-access/UlsLanguageTranslationRepository';

function newUlsLanguageRepository( getLanguageNameByCode: ( langCode: string ) => string ) {
	return new UlsLanguageTranslationRepository( getLanguageNameByCode );
}

describe( 'UlsLanguageTranslationRepository', () => {

	it( 'gets the language name from the given function', () => {
		const mockWbGetLanguageNameByCode = jest.fn();
		const langTranslation = 'English';
		mockWbGetLanguageNameByCode.mockReturnValue( langTranslation );

		return newUlsLanguageRepository( mockWbGetLanguageNameByCode )
			.getLanguagesInLanguage( 'en' ).then( ( name ) => {
				expect( mockWbGetLanguageNameByCode ).toBeCalledWith( 'en' );
				expect( name ).toEqual( {
					en: {
						en: langTranslation,
					},
				} );
			} );
	} );

} );
