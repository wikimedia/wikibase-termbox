import { Module } from 'vuex';
import Entity from '@/store/entity/Entity';
import { getters } from '@/store/entity/getters';
import { mutations } from '@/store/entity/mutations';

const state: Entity = {
	id: '',
	labels: {},
	descriptions: {},
	aliases: {},
};

const namespaced: boolean = true;

export const entity: Module<Entity, any> = {
	namespaced,
	state,
	getters,
	mutations,
};
