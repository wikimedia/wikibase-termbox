import { actions } from '@/store/actions';
import {
	EDITMODE_ACTIVATE,
	EDITMODE_DEACTIVATE,
} from '@/store/actionTypes';
import { EDITMODE_SET } from '@/store/mutationTypes';
import newMockStore from '@wmde/vuex-helpers/dist/newMockStore';

describe( 'root/actions', () => {
	describe( EDITMODE_ACTIVATE, () => {
		it( `commits to ${EDITMODE_SET}`, () => {

			const context = newMockStore( {
				commit: jest.fn(),
			} );

			actions[ EDITMODE_ACTIVATE ]( context );
			expect( context.commit ).toBeCalledWith(
				EDITMODE_SET,
				true,
			);
		} );
	} );

	describe( EDITMODE_DEACTIVATE, () => {
		it( `commits to ${EDITMODE_SET}`, () => {

			const context = newMockStore( {
				commit: jest.fn(),
			} );

			actions[ EDITMODE_DEACTIVATE ]( context );
			expect( context.commit ).toBeCalledWith(
				EDITMODE_SET,
				false,
			);
		} );
	} );

} );
