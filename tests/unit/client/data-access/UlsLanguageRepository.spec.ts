import UlsLanguageRepository from '@/client/data-access/UlsLanguageRepository';

function newUlsLanguageRepository() {
	return new UlsLanguageRepository();
}

describe( 'UlsLanguageRepository', () => {

	it( 'gets the language name from ULS', () => {
		return newUlsLanguageRepository().getLanguageName( 'en', 'en' ).then( ( name ) => {
			expect( name ).toBe( 'English' );
		} );
	} );

} );
