import UlsLanguageRepository from '@/client/data-access/UlsLanguageRepository';
import { StringTMap } from '@/datamodel/LanguageTranslations';

describe( 'UlsLanguageRepository', () => {
	it( 'get WikibaseContentLanguages and uls to build a language collection', () => {
		const langTranslation = { en: 'English', he: 'Hebrew', ar: 'Arabic', de: 'German' } as StringTMap<string>;
		const langDirs = { en: 'ltr', he: 'rtl', ar: 'rtl', de: 'ltr' } as StringTMap<string>;
		const translator = {
			getAllPairs: () => langTranslation,
		};
		const directionalities = {
			getDir: ( code: string ) => langDirs[ code ],
		};
		return (
			new UlsLanguageRepository(
				translator,
				directionalities,
		) ).getLanguages().then( ( languages ) => {
			expect( languages ).toEqual( {
				en: {
					code: 'en',
					directionality: 'ltr',
				},
				he: {
					code: 'he',
					directionality: 'rtl',
				},
				ar: {
					code: 'ar',
					directionality: 'rtl',
				},
				de: {
					code: 'de',
					directionality: 'ltr',
				},
			} );
		} );
	} );
} );
