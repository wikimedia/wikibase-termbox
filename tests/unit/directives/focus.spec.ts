import focus from '@/directives/focus';

describe( 'focus directive', () => {
	it( 'calls the focus method of an element', () => {
		const element = document.createElement( 'div' );
		element.focus = jest.fn();
		( focus.inserted as Function )( element );
		expect( element.focus ).toBeCalledTimes( 1 );
	} );
} );
