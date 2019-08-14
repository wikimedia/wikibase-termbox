import { Module } from 'vuex';
import User from '@/store/user/User';
import { actions } from '@/store/user/actions';
import { getters } from '@/store/user/getters';
import { mutations } from '@/store/user/mutations';

export default function (): Module<User, any> {
	const state: User = {
		name: null,
		primaryLanguage: '',
		secondaryLanguages: [],
		preferences: {},
	};

	return {
		namespaced: true,
		state,
		actions,
		getters,
		mutations,
	};
}
