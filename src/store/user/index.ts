import { Module } from 'vuex';
import User from '@/store/user/User';
import createActions from '@/store/user/actions';
import { getters } from '@/store/user/getters';
import { mutations } from '@/store/user/mutations';
import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';
import TempUserConfiguration from '@/common/data-access/TempUserConfiguration';

export default function (
	userPreferenceRepository: UserPreferenceRepository,
	tempUserConfig: TempUserConfiguration,
): Module<User, any> {
	const state: User = {
		name: null,
		primaryLanguage: '',
		secondaryLanguages: [],
		preferences: {},
		tempUserEnabled: tempUserConfig.isEnabled(),
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
