import { ActionContext } from 'vuex';
import Messages from '@/store/messages/Messages';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import { MESSAGES_INIT as MESSAGES_INIT_MUTATION } from '@/store/messages/mutationTypes';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import MessagesRepository from '@/common/data-access/MessagesRepository';

export default function actions(
	messagesRepository: MessagesRepository,
) {
	return {

		[ MESSAGES_INIT ]( context: ActionContext<Messages, any>, inLanguage: string ): Promise<void> {
			return messagesRepository.getMessagesInLanguage( inLanguage )
				.then( ( messages: MessageTranslationCollection ) => {
					context.commit( MESSAGES_INIT_MUTATION, messages );
				} );
		},
	};
}
