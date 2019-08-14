import { Module } from 'vuex';
import EntityState from '@/store/entity/EntityState';
import { getters } from '@/store/entity/getters';
import { mutations } from '@/store/entity/mutations';
import { actions } from '@/store/entity/actions';

export default function (): Module<EntityState, any> {
	const state: EntityState = {
		id: '',
		baseRevision: 0,
		labels: {},
		descriptions: {},
		aliases: {},
		baseRevisionFingerprint: null,
		isEditable: false,
	};

	return {
		namespaced: true,
		state,
		getters,
		mutations,
		actions,
	};
}
