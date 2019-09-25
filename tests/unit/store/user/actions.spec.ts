import actions from '@/store/user/actions';
import {
	LANGUAGE_PREFERENCE,
	USER_NAME_SET,
	USER_PREFERENCES_INIT,
	USER_PREFERENCE_SET,
} from '@/store/user/actionTypes';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
	USER_SET_NAME,
	USER_SET_PREFERENCE,
} from '@/store/user/mutationTypes';
import {
	NS_LANGUAGE,
	NS_MESSAGES,
} from '@/store/namespaces';
import { ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import { action } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import newMockStore from '@wmde/vuex-helpers/dist/newMockStore';
import { UserPreference } from '@/common/UserPreference';

describe( 'user/actions', () => {
	describe( LANGUAGE_PREFERENCE, () => {
		it( 'commits user language as well as the secondary languages and ensures language translations', ( done ) => {
			const primaryLanguage = 'de';
			const commitMock = jest.fn();
			const dispatchMock = jest.fn();
			dispatchMock.mockResolvedValue( Promise.resolve() );
			const context = newMockStore( {
				commit: commitMock,
				dispatch: dispatchMock,
			} );

			const preferredLanguages = [ 'de', 'en', 'fr', 'zh', 'pl', 'hu' ];

			actions(
				{} as any,
			)[ LANGUAGE_PREFERENCE ]( context, { primaryLanguage, preferredLanguages } ).then( () => {
				expect( commitMock ).toBeCalledWith(
					LANGUAGE_INIT,
					primaryLanguage,
				);

				expect( commitMock ).toBeCalledWith(
					SECONDARY_LANGUAGES_INIT,
					[ 'en', 'fr', 'zh', 'pl', 'hu' ],
				);

				expect( dispatchMock ).toBeCalledWith(
					action( NS_LANGUAGE, ENSURE_AVAILABLE_IN_LANGUAGE ),
					primaryLanguage,
					{ root: true },
				);
				expect( dispatchMock ).toBeCalledWith(
					action( NS_MESSAGES, MESSAGES_INIT ),
					primaryLanguage,
					{ root: true },
				);
				done();
			} );
		} );
	} );

	it( USER_NAME_SET, () => {
		const context = newMockStore( {} );
		const name = 'Lord Voldemort';
		actions(
			{} as any,
		)[ USER_NAME_SET ]( context, name );

		expect( context.commit ).toHaveBeenCalledWith( USER_SET_NAME, name );
	} );

	it( USER_PREFERENCES_INIT, () => {
		const context = newMockStore( {} );
		const preferenceStubs: { [preference in UserPreference]: any } = {
			[ UserPreference.HIDE_ANON_EDIT_WARNING ]: true,
			[ UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION ]: 'wikibase-1',
		};
		const prefsRepo = {
			setPreference: jest.fn(),
			getPreference: jest.fn().mockImplementation(
				( preference: UserPreference ) => Promise.resolve( preferenceStubs[ preference ] ),
			),
		};

		return actions(
			prefsRepo,
		)[ USER_PREFERENCES_INIT ]( context ).then( () => {
			Object.values( UserPreference ).forEach( ( preference: UserPreference ) => {
				expect( prefsRepo.getPreference ).toHaveBeenCalledWith( preference );
				expect( context.commit ).toHaveBeenCalledWith(
					USER_SET_PREFERENCE,
					{ name: preference, value: preferenceStubs[ preference ] },
				);
			} );
		} );
	} );

	it( USER_PREFERENCE_SET, () => {
		const context = newMockStore( {} );
		const prefsRepo = {
			setPreference: jest.fn().mockReturnValue( Promise.resolve() ),
			getPreference: jest.fn(),
		};
		const preferenceName = UserPreference.HIDE_ANON_EDIT_WARNING;
		const preferenceValue = true;

		return actions(
			prefsRepo,
		)[ USER_PREFERENCE_SET ]( context, { name: preferenceName, value: preferenceValue } ).then( () => {
			expect( prefsRepo.setPreference ).toHaveBeenCalledWith( preferenceName, preferenceValue );
			expect( context.commit ).toHaveBeenCalledWith(
				USER_SET_PREFERENCE,
				{ name: preferenceName, value: preferenceValue },
			);
		} );
	} );
} );
