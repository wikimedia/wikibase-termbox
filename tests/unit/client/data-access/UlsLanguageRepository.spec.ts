import UlsLanguageRepository from '@/client/data-access/UlsLanguageRepository';
import { StringTMap } from '@/datamodel/LanguageTranslations';

describe( 'UlsLanguageRepository', () => {
	it( 'get WikibaseContentLanguages and uls to build a language collection', () => {
		const langTranslation: StringTMap<string> = { en: 'English', he: 'Hebrew', ar: 'Arabic', de: 'German' };
		const langDirs: StringTMap<string> = { en: 'ltr', he: 'rtl', ar: 'rtl', de: 'ltr' };
		const translator = {
			getLanguageNameMap: () => langTranslation,
		};
		const directionalities = {
			getDir: ( code: string ) => langDirs[ code ],
		};
		return ( new UlsLanguageRepository(
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
