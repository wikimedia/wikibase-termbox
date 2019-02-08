import inlanguage from '@/client/directives/inlanguage';
import Language from '@/datamodel/Language';

describe( 'inlanguage directive', () => {
	it( 'adds language properties to element\'s attributes', () => {
		const language: Language = { code: 'de', directionality: 'ltr' };
		const element = document.createElement( 'div' );
		element.setAttribute = jest.fn();

		inlanguage( element, {
			modifiers: {},
			name: 'inlanguage',
			value: language,
		} );

		expect( element.setAttribute ).toBeCalledWith( 'lang', language.code );
		expect( element.setAttribute ).toBeCalledWith( 'dir', language.directionality );
	} );
} );
