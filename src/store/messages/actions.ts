import { ActionContext, ActionTree } from 'vuex';
import Messages from '@/store/messages/Messages';
import { factory } from '@/common/TermboxFactory';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import { MESSAGES_INIT as MESSAGES_INIT_MUTATION } from '@/store/messages/mutationTypes';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';

export const actions: ActionTree<Messages, any> = {

	[ MESSAGES_INIT ]( context: ActionContext<Messages, any>, inLanguage: string ): Promise<void> {
		return factory.getMessagesRepository().getMessagesInLanguage( inLanguage )
			.then( ( messages: MessageTranslationCollection ) => {
				context.commit( MESSAGES_INIT_MUTATION, messages );
			} );
	},

};
