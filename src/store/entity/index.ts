import { Module } from 'vuex';
import EntityState from '@/store/entity/EntityState';
import EntityRepository from '@/common/data-access/EntityRepository';
import EntityEditabilityResolver from '@/common/data-access/EntityEditabilityResolver';
import WritingEntityRepository from '@/common/data-access/WritingEntityRepository';
import { getters } from '@/store/entity/getters';
import { mutations } from '@/store/entity/mutations';
import createActions from '@/store/entity/actions';

export default function (
	entityRepository: EntityRepository,
	entityEditabilityResolver: EntityEditabilityResolver,
	writingEntityRepository: WritingEntityRepository,
): Module<EntityState, any> {
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
		actions: createActions(
			entityRepository,
			entityEditabilityResolver,
			writingEntityRepository,
		),
	};
}
