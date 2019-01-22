import { mutations } from '@/store/user/mutations';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
} from '@/store/user/mutationTypes';
import {
	emptyUserType,
} from '../data/UserStores';
import InvalidLanguageValueException from '@/store/user/exceptions/InvalidLanguageValueException';

describe( '/store/user/mutations.ts', () => {
	it( 'throws a exceptions if the given type is invalid during initialisation', () => {
		expect( () => {
			mutations[ LANGUAGE_INIT ]( emptyUserType, {} );
		} ).toThrow( InvalidLanguageValueException );

		expect( () => {
			mutations[ LANGUAGE_INIT ]( emptyUserType, 'e' );
		} ).toThrow( InvalidLanguageValueException );
	} );

	it( 'contains the primary language', () => {
		const primaryLanguage = 'de';
		mutations[ LANGUAGE_INIT ]( emptyUserType, primaryLanguage );

		expect( emptyUserType.primaryLanguage ).toStrictEqual( primaryLanguage );
	} );

	it( 'throws a exceptions if the given type is invalid during initialisation of secondary languages', () => {
		const primaryLanguage = 'de';
		expect( () => {
			mutations[ SECONDARY_LANGUAGES_INIT ]( emptyUserType, { primaryLanguage, secondaryLanguages: {} } );
		} ).toThrow( InvalidLanguageValueException );

		expect( () => {
			mutations[ SECONDARY_LANGUAGES_INIT ]( emptyUserType, { primaryLanguage, secondaryLanguages: [] } );
		} ).toThrow( InvalidLanguageValueException );
	} );

	it( 'contains data the secondary languages', () => {
		const secondaryLanguages = [ 'de', 'en', 'it', 'zh', 'ug', 'ar', 'kl' ];
		mutations[ SECONDARY_LANGUAGES_INIT ]( emptyUserType, secondaryLanguages );
		expect( emptyUserType.secondaryLanguages ).toStrictEqual( secondaryLanguages );
	} );
} );
