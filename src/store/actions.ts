import { ActionContext } from 'vuex';
import Root from '@/store/Root';
import {
	EDITMODE_ACTIVATE,
	EDITMODE_DEACTIVATE,
} from '@/store/actionTypes';
import { EDITMODE_SET } from '@/store/mutationTypes';

export const actions = {
	[ EDITMODE_ACTIVATE ]( context: ActionContext<Root, any> ): void {
		context.commit( EDITMODE_SET, true );
	},

	[ EDITMODE_DEACTIVATE ]( context: ActionContext<Root, any> ): void {
		context.commit( EDITMODE_SET, false );
	},
};
