import { mutations } from '@/store/user/mutations';
import { lockState } from '../lockState';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
} from '@/store/user/mutationTypes';
import InvalidLanguageValueException from '@/store/user/exceptions/InvalidLanguageValueException';
import User from '@/store/user/User';

function newUserState(): User {
	const state = {
		primaryLanguage: '',
		secondaryLanguages: [],
	};

	lockState( state );

	return state;
}

describe( '/store/user/mutations.ts', () => {
	it( 'throws a exceptions if the given type is invalid during initialisation', () => {
		expect( () => {
			mutations[ LANGUAGE_INIT ]( newUserState(), {} );
		} ).toThrow( InvalidLanguageValueException );

		expect( () => {
			mutations[ LANGUAGE_INIT ]( newUserState(), 'e' );
		} ).toThrow( InvalidLanguageValueException );
	} );

	it( 'contains the primary language', () => {
		const primaryLanguage = 'de';
		const userState = newUserState();

		mutations[ LANGUAGE_INIT ]( userState, primaryLanguage );

		expect( userState.primaryLanguage ).toStrictEqual( primaryLanguage );
	} );

	it( 'throws a exceptions if the given type is invalid during initialisation of secondary languages', () => {
		const primaryLanguage = 'de';
		expect( () => {
			mutations[ SECONDARY_LANGUAGES_INIT ]( newUserState(), { primaryLanguage, secondaryLanguages: {} } );
		} ).toThrow( InvalidLanguageValueException );

		expect( () => {
			mutations[ SECONDARY_LANGUAGES_INIT ]( newUserState(), { primaryLanguage, secondaryLanguages: [] } );
		} ).toThrow( InvalidLanguageValueException );
	} );

	it( 'contains data the secondary languages', () => {
		const userState = newUserState();
		const secondaryLanguages = [ 'de', 'en', 'it', 'zh', 'ug', 'ar', 'kl' ];
		mutations[ SECONDARY_LANGUAGES_INIT ]( userState, secondaryLanguages );
		expect( userState.secondaryLanguages ).toStrictEqual( secondaryLanguages );
	} );
} );
