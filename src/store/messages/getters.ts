import { GetterTree } from 'vuex';
import Messages from '@/store/messages/Messages';
import MessageCollection from '@/datamodel/MessageCollection';
import { MessageKey } from '@/common/MessageKey';

export const getters: GetterTree<Messages, any> = {
	getAllMessagesInLanguage: ( state: Messages ) => ( inLanguage: string ): MessageCollection | null => {
		return state.messages[ inLanguage ] || null;
	},

	getMessageInLanguage: ( state: Messages ) => ( inLanguage: string, messageKey: MessageKey ): string | null => {
		const translations = state.messages[ inLanguage ];
		if ( !translations ) {
			return null;
		}
		return translations[ messageKey ] || null;
	},
};
