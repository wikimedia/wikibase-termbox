import { MutationTree } from 'vuex';
import Root from '@/store/Root';
import {
	EDITMODE_SET,
} from '@/store/mutationTypes';

export const mutations: MutationTree<Root> = {
	[ EDITMODE_SET ]( state: Root, isEditible: boolean ): void {
		state.editMode = isEditible;
	},
};
