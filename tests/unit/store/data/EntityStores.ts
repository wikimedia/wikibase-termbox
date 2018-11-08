import { Module } from 'vuex';
import EntityInitializer from '@/store/entity/EntityInitializer';
import Entity from '@/store/entity/Entity';
import EntityClass from '@/common/Entity';
import { getters } from '@/store/entity/getters';
import * as MockData from '@/mock-data/data/Q64_data.json';

const namespaced: boolean = false;
export const emptyEntity: EntityClass = EntityInitializer.initializeEntity( { id: 'Q123', type: 'item' } );
export const filledEntity: EntityClass = EntityInitializer.initializeEntity( MockData.default );

let state: Entity = {
	id: '',
	type: '',
	labels: {},
	descriptions: {},
	aliases: {},
};

export const emptyEntityType: Entity = state;
export const emptyEntityModule: Module<Entity, any> = {
	namespaced,
	state,
	getters,
};

state = {
	id: filledEntity.id,
	type: filledEntity.type,
	labels: filledEntity.labels,
	descriptions: filledEntity.descriptions,
	aliases: filledEntity.aliases,
};

export const filledEntityType: Entity = state;
export const filledEntityModule: Module<Entity, any> = {
	namespaced,
	state,
	getters,
};
