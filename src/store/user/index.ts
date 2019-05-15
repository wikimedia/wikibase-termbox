import { Module } from 'vuex';
import User from '@/store/user/User';
import { actions } from '@/store/user/actions';
import { mutations } from '@/store/user/mutations';

export default function (): Module<User, any> {
	const state: User = {
		name: null,
		primaryLanguage: '',
		secondaryLanguages: [],
	};

	const namespaced = true;

	return {
		namespaced,
		state,
		actions,
		mutations,
	};
}
