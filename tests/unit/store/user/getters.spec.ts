import { getters } from '@/store/user/getters';
import {
	filledUserType,
} from '../data/UserStores';

describe( '/store/user/getters.ts', () => {
	it( 'returns the primary language key', () => {
		expect( getters.primaryLanguage( filledUserType, null, null, null ) )
			.toMatch( filledUserType.primaryLanguage );
	} );
} );
