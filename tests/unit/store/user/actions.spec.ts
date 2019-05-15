import { actions } from '@/store/user/actions';
import {
	LANGUAGE_PREFERENCE,
	USER_NAME_SET,
} from '@/store/user/actionTypes';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
	USER_SET_NAME,
} from '@/store/user/mutationTypes';
import {
	NS_LANGUAGE,
	NS_MESSAGES,
} from '@/store/namespaces';
import { ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import { action } from '@/store/util';
import newMockStore from '../newMockStore';

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

			actions[ LANGUAGE_PREFERENCE ]( context, { primaryLanguage, preferredLanguages } ).then( () => {
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
		actions[ USER_NAME_SET ]( context, name );

		expect( context.commit ).toHaveBeenCalledWith( USER_SET_NAME, name );
	} );
} );
