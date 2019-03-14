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
} );
