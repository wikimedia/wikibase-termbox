import { ActionContext } from 'vuex';
import Messages from '@/store/messages/Messages';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import { MESSAGES_INIT as MESSAGES_INIT_MUTATION } from '@/store/messages/mutationTypes';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import MessagesRepository from '@/common/data-access/MessagesRepository';

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export default (
	messagesRepository: MessagesRepository,
) => ( {
	[ MESSAGES_INIT ]( context: ActionContext<Messages, any>, inLanguage: string ): Promise<void> {
		return messagesRepository.getMessagesInLanguage( inLanguage )
			.then( ( messages: MessageTranslationCollection ) => {
				context.commit( MESSAGES_INIT_MUTATION, messages );
			} );
	},
} );
