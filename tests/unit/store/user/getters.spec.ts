import { getters } from '@/store/user/getters';
import User from '@/store/user/User';

describe( '/store/user/getters.ts', () => {
	describe( 'primaryLanguage', () => {
		it( 'returns the primary language key', () => {
			const state: User = {
				primaryLanguage: 'de',
				secondaryLanguages: [],
			};

			expect( getters.primaryLanguage( state, null, null, null ) )
				.toMatch( state.primaryLanguage );
		} );
	} );

	describe( 'topSecondaryLanguages', () => {
		it( 'returns first 4 of the secondary languages', () => {
			const state: User = {
				primaryLanguage: 'de',
				secondaryLanguages: [ 'en', 'fr', 'it', 'zh', 'ko', 'hu' ],
			};
			expect( getters.topSecondaryLanguages( state, null, null, null ) )
				.toEqual( [ 'en', 'fr', 'it', 'zh' ] );
		} );
	} );
} );
