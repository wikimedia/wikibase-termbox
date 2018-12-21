import { Module } from 'vuex';
import User from '@/store/user/User';
import { actions } from '@/store/user/actions';
import { getters } from '@/store/user/getters';
import { mutations } from '@/store/user/mutations';

export default function (): Module<User, any> {
	const state: User = {
		primaryLanguage: '',
	};

	const namespaced = true;

	return {
		namespaced,
		state,
		actions,
		getters,
		mutations,
	};
}
