import { actions } from '@/store/actions';
import {
	EDITMODE_ACTIVATE,
	EDITMODE_DEACTIVATE,
} from '@/store/actionTypes';
import { EDITMODE_SET } from '@/store/mutationTypes';
import newMockStore from './newMockStore';

describe( 'root/actions', () => {
	describe( EDITMODE_ACTIVATE, () => {
		it( `commits to ${ EDITMODE_SET }`, ( done ) => {

			const context = newMockStore( {
				commit: jest.fn(),
			} );

			actions[ EDITMODE_ACTIVATE ]( context ).then( () => {
				expect( context.commit ).toBeCalledWith(
					EDITMODE_SET,
					true,
				);

				done();
			} );
		} );
	} );

	describe( EDITMODE_DEACTIVATE, () => {
		it( `commits to ${ EDITMODE_SET }`, ( done ) => {

			const context = newMockStore( {
				commit: jest.fn(),
			} );

			actions[ EDITMODE_DEACTIVATE ]( context ).then( () => {
				expect( context.commit ).toBeCalledWith(
					EDITMODE_SET,
					false,
				);

				done();
			} );
		} );
	} );

} );
