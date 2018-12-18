import { Module } from 'vuex';
import Messages from '@/store/messages/Messages';
import { getters } from '@/store/messages/getters';
import { mutations } from '@/store/messages/mutations';
import { actions } from '@/store/messages/actions';

export default function (): Module<Messages, any> {
	const state: Messages = {
		messages: {},
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
