import createLanguage from '@/store/language';

describe( 'store/language/index', () => {
	it( 'creates a language store', () => {
		const module = createLanguage(
			{} as any,
			{} as any,
		);
		expect( module.state ).toEqual( {
			translations: {},
			languages: {},
		} );
	} );
} );
