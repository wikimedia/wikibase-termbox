import { getters } from '@/store/user/getters';
import {
	filledUserType,
} from '../data/UserStores';

describe( '/store/user/getters.ts', () => {
	describe( 'primaryLanguage', () => {
		it( 'returns the primary language key', () => {
			expect( getters.primaryLanguage( filledUserType, null, null, null ) )
				.toMatch( filledUserType.primaryLanguage );
		} );
	} );

	describe( 'topSecondaryLanguages', () => {
		it( 'returns first 4 of the secondary languages', () => {
			expect( getters.topSecondaryLanguages( filledUserType, null, null, null ) )
				.toEqual( [ 'en', 'fr', 'it', 'zh' ] );
		} );
	} );
} );
