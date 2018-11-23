import { actions } from '@/store/user/actions';
import { LANGUAGE_PREFERENCE } from '@/store/user/actionTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { NS_LANGUAGE } from '@/store/namespaces';
import { ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';

describe( 'user/actions', () => {
	describe( LANGUAGE_PREFERENCE, () => {
		it( 'commits user language and ensures language translations', ( done ) => {
			const inLanguage = 'de';

			const commitMock = jest.fn();
			const dispatchMock = jest.fn();
			dispatchMock.mockResolvedValue( Promise.resolve() );
			const context = {
				commit: commitMock,
				dispatch: dispatchMock,
			};
			const action = actions[ LANGUAGE_PREFERENCE ] as any; // TODO

			action( context, inLanguage ).then( () => {
				expect( commitMock ).toBeCalledWith(
					LANGUAGE_INIT,
					inLanguage,
				);
				expect( dispatchMock ).toBeCalledWith(
					`${NS_LANGUAGE}/${ENSURE_AVAILABLE_IN_LANGUAGE}`,
					inLanguage,
					{ root: true },
				);
				done();
			} );
		} );
	} );
} );
