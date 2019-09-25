import { Module } from 'vuex';
import User from '@/store/user/User';
import createActions from '@/store/user/actions';
import { getters } from '@/store/user/getters';
import { mutations } from '@/store/user/mutations';
import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';

export default function (
	userPreferenceRepository: UserPreferenceRepository,
): Module<User, any> {
	const state: User = {
		name: null,
		primaryLanguage: '',
		secondaryLanguages: [],
		preferences: {},
	};

	return {
		namespaced: true,
		state,
		actions: createActions(
			userPreferenceRepository,
		),
		getters,
		mutations,
	};
}
