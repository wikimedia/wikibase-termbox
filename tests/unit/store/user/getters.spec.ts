import { getters } from '@/store/user/getters';
import newUserState from './newUserState';

describe( 'user/getters', () => {

	describe( 'isAnonymous', () => {
		it( 'returns false if a user name is known', () => {
			const user = newUserState( {
				name: 'Jane Doe',
			} );

			expect( getters.isAnonymous(
				user, null, null, null,
			) ).toStrictEqual( false );
		} );

		it( 'returns true if a user name is not known', () => {
			const user = newUserState( {
				name: null,
			} );

			expect( getters.isAnonymous(
				user, null, null, null,
			) ).toStrictEqual( true );
		} );

	} );
} );
