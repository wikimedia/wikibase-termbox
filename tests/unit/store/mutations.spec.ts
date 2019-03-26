import { mutations } from '@/store/mutations';
import {
	EDITMODE_SET,
} from '@/store/mutationTypes';
import Root from '@/store/Root';

describe( 'root/mutations', () => {

	describe( EDITMODE_SET, () => {
		it( 'changes the editMode state of the store', () => {
			const store: Root = { editMode: false };

			mutations[ EDITMODE_SET ]( store, true );

			expect( store.editMode ).toBeTruthy();
		} );
	} );
} );
