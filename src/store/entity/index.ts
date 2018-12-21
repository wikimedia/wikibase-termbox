import { Module } from 'vuex';
import Entity from '@/store/entity/Entity';
import { getters } from '@/store/entity/getters';
import { mutations } from '@/store/entity/mutations';
import { actions } from '@/store/entity/actions';

export default function (): Module<Entity, any> {
	const state: Entity = {
		id: '',
		labels: {},
		descriptions: {},
		aliases: {},
	};

	const namespaced = true;

	return {
		namespaced,
		state,
		getters,
		mutations,
		actions,
	};
}
