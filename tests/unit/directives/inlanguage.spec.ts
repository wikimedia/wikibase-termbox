import inlanguage from '@/directives/inlanguage';
import Language from '@/datamodel/Language';
import { getter } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_LANGUAGE } from '@/store/namespaces';

describe( 'inlanguage directive', () => {
	it( 'adds language properties to element\'s attributes', () => {
		const languageCode = 'de';
		const language: Language = { code: languageCode, directionality: 'ltr' };
		const mockGetter = jest.fn().mockImplementation( ( _code: string ) => language );
		const element = document.createElement( 'div' );
		element.setAttribute = jest.fn();

		inlanguage(
			element,
			{
				modifiers: {},
				name: 'inlanguage',
				value: languageCode,
				instance: {
					$store: {
						getters: {
							[ getter( NS_LANGUAGE, 'getByCode' ) ]: mockGetter,
						},
					},
				},
			},
		);

		expect( mockGetter ).toHaveBeenCalledWith( languageCode );
		expect( element.setAttribute ).toHaveBeenCalledWith( 'lang', language.code );
		expect( element.setAttribute ).toHaveBeenCalledWith( 'dir', language.directionality );
	} );
} );
