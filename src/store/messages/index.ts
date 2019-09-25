import { Module } from 'vuex';
import Messages from '@/store/messages/Messages';
import { getters } from '@/store/messages/getters';
import { mutations } from '@/store/messages/mutations';
import createActions from '@/store/messages/actions';
import MessagesRepository from '@/common/data-access/MessagesRepository';

export default function (
	messagesRepository: MessagesRepository,
): Module<Messages, any> {
	const state: Messages = {
		messages: {},
	};

	return {
		namespaced: true,
		state,
		getters,
		mutations,
		actions: createActions( messagesRepository ),
	};
}
