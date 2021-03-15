import UlsLanguageTranslationRepository from '@/client/data-access/UlsLanguageTranslationRepository';
import { StringTMap } from '@/datamodel/LanguageTranslations';

describe( 'UlsLanguageTranslationRepository', () => {
	it( 'gets the language name from the given function', () => {
		const langTranslation = { en: 'English' };
		const translator = {
			getLanguageNameMap: (): StringTMap<string> => langTranslation,
		};

		return (
			new UlsLanguageTranslationRepository( translator )
		).getLanguagesInLanguage( 'en' ).then( ( name ) => {
			expect( name ).toEqual( {
				en: langTranslation,
			} );
		} );
	} );
} );
