import { mutations } from '@/store/user/mutations';
import {
	LANGUAGE_INIT,
} from '@/store/user/mutationTypes';
import {
	emptyUserType,
} from '../data/UserStores';
import InvalidLanguageValueException from '@/store/user/exceptions/InvalidLanguageValueException';

describe( '/store/user/mutations.ts', () => {
	it( 'throws a exceptions if the given type is invalid during initialisation', () => {
		expect( () => {
			mutations[LANGUAGE_INIT]( emptyUserType, {} );
		} ).toThrow( InvalidLanguageValueException );

		expect( () => {
			mutations[`${ LANGUAGE_INIT }`]( emptyUserType, 'e' );
		} ).toThrow( InvalidLanguageValueException );
	} );

	it( 'contains data after initializing', () => {
		function init() {
			mutations[`${ LANGUAGE_INIT }`] ( emptyUserType, 'de' );
			return [
				emptyUserType.primaryLanguage,
			];
		}

		expect( init() ).toStrictEqual( [ 'de' ] );
	} );
} );
