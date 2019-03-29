import { MutationTree } from 'vuex';
import Messages from '@/store/messages/Messages';
import {
	MESSAGES_INIT,
} from '@/store/messages/mutationTypes';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';

export const mutations: MutationTree<Messages> = {
	[ MESSAGES_INIT ]( state: Messages, messages: MessageTranslationCollection ): void {
		state.messages = {};
		Object.entries( messages ).forEach( ( [ inLanguage, translations ] ) => {
			state.messages[ inLanguage ] = translations;
		} );
	},
};
