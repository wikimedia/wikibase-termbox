import { GetterTree } from 'vuex';
import Messages from '@/store/messages/Messages';
import MessageCollection from '@/datamodel/MessageCollection';

export const getters: GetterTree<Messages, any> = {
	getAllMessagesInLanguage: ( state: Messages ) => ( inLanguage: string ): MessageCollection | null => {
		return state.messages[ inLanguage ] || null;
	},

	getMessageInLanguage: ( state: Messages ) => ( inLanguage: string, messageKey: string ): string | null => {
		const message = state.messages[ inLanguage ];
		if ( !message ) {
			return null;
		}
		return message[ messageKey ] || null;
	},
};
