import actions from '@/store/messages/actions';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import { MESSAGES_INIT as MESSAGES_INIT_MUTATION } from '@/store/messages/mutationTypes';
import newMockStore from '@wmde/vuex-helpers/dist/newMockStore';
import { MessageKey } from '@/common/MessageKey';

describe( 'messages/actions', () => {
	describe( MESSAGES_INIT, () => {
		it( `commits to ${MESSAGES_INIT_MUTATION}`, ( done ) => {

			const mockMessages = {
				de: {
					[ MessageKey.CANCEL ]: 'abbrechen',
					[ MessageKey.EDIT ]: 'b e a r b e i t e n',
				},
			};

			const messagesRepository = {
				getMessagesInLanguage: () => Promise.resolve( mockMessages ),
			};

			const context = newMockStore( {
				commit: jest.fn(),
			} );

			actions(
				messagesRepository,
			)[ MESSAGES_INIT ]( context, 'de' ).then( () => {
				expect( context.commit ).toBeCalledWith(
					MESSAGES_INIT_MUTATION,
					mockMessages,
				);
				done();
			} );
		} );
	} );
} );
