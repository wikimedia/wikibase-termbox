import { actions } from '@/store/user/actions';
import { LANGUAGE_PREFERENCE } from '@/store/user/actionTypes';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
} from '@/store/user/mutationTypes';
import {
	NS_LANGUAGE,
	NS_MESSAGES,
} from '@/store/namespaces';
import { ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import { action } from '@/store/util';

describe( 'user/actions', () => {
	describe( LANGUAGE_PREFERENCE, () => {
		it( 'commits user language as well as the frequent languages and ensures language translations', ( done ) => {
			const primaryLanguage = 'de';

			const commitMock = jest.fn();
			const dispatchMock = jest.fn();
			dispatchMock.mockResolvedValue( Promise.resolve() );
			const context = {
				commit: commitMock,
				dispatch: dispatchMock,
			};

			const secondaryLanguages = [ 'de', 'en', 'fr', 'zh', 'pl' ];
			const languagePreferenceAction = actions[ LANGUAGE_PREFERENCE ] as any; // TODO

			languagePreferenceAction( context, { primaryLanguage, secondaryLanguages } ).then( () => {
				expect( commitMock ).toBeCalledWith(
					LANGUAGE_INIT,
					primaryLanguage,
				);

				expect( commitMock ).toBeCalledWith(
					SECONDARY_LANGUAGES_INIT,
					[ 'en', 'fr', 'zh', 'pl' ],
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
} );
