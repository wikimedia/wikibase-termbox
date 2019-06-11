import { mutations } from '@/store/user/mutations';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
} from '@/store/user/mutationTypes';
import InvalidLanguageValueException from '@/store/user/exceptions/InvalidLanguageValueException';
import { USER_SET_NAME } from '@/store/user/mutationTypes';
import { USER_SET_PREFERENCE } from '@/store/user/mutationTypes';
import { UserPreference } from '@/common/UserPreference';
import newUserState from './newUserState';

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

	it( USER_SET_NAME, () => {
		const userState = newUserState();
		const name = 'Lord Voldemort';
		mutations[ USER_SET_NAME ]( userState, name );
		expect( userState.name ).toBe( name );
	} );

	it( USER_SET_PREFERENCE, () => {
		const state = newUserState();
		mutations[ USER_SET_PREFERENCE ]( state, { name: UserPreference.HIDE_ANON_EDIT_WARNING, value: true } );
		expect( state.preferences[ UserPreference.HIDE_ANON_EDIT_WARNING ] ).toBe( true );
	} );
} );
