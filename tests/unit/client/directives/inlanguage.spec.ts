import inlanguage from '@/client/directives/inlanguage';
import Language from '@/datamodel/Language';
import { getters } from '@/store/util';
import { NS_LANGUAGE } from '@/store/namespaces';

describe( 'inlanguage directive', () => {
	it( 'adds language properties to element\'s attributes', () => {
		const languageCode = 'de';
		const language: Language = { code: languageCode, directionality: 'ltr' };
		const getter = jest.fn().mockImplementation( ( _code: string ) => language );
		const element = document.createElement( 'div' );
		element.setAttribute = jest.fn();

		inlanguage(
			element,
			{
				modifiers: {},
				name: 'inlanguage',
				value: languageCode,
			},
			{
				context: {
					$store: {
						getters: {
							[ getters( NS_LANGUAGE, 'getByCode' ) ]: getter,
						},
					},
				},
			} as any,
		);

		expect( getter ).toHaveBeenCalledWith( languageCode );
		expect( element.setAttribute ).toHaveBeenCalledWith( 'lang', language.code );
		expect( element.setAttribute ).toHaveBeenCalledWith( 'dir', language.directionality );
	} );
} );
