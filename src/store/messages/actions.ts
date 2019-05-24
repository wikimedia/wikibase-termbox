import { ActionContext } from 'vuex';
import Messages from '@/store/messages/Messages';
import { services } from '@/common/TermboxServices';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import { MESSAGES_INIT as MESSAGES_INIT_MUTATION } from '@/store/messages/mutationTypes';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';

export const actions = {

	[ MESSAGES_INIT ]( context: ActionContext<Messages, any>, inLanguage: string ): Promise<void> {
		return services.getMessagesRepository().getMessagesInLanguage( inLanguage )
			.then( ( messages: MessageTranslationCollection ) => {
				context.commit( MESSAGES_INIT_MUTATION, messages );
			} );
	},

};
