import { actions } from '@/store/messages/actions';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import { MESSAGES_INIT as MESSAGES_INIT_MUTATION } from '@/store/messages/mutationTypes';
import { services } from '@/common/TermboxServices';
import newMockStore from '../newMockStore';

describe( 'messages/actions', () => {
	describe( MESSAGES_INIT, () => {
		it( `commits to ${MESSAGES_INIT_MUTATION}`, ( done ) => {

			const mockMessages = {
				de: {
					test1: 'test',
					test2: 'teststring with spaces',
				},
			};

			services.setMessagesRepository( {
				getMessagesInLanguage: () => Promise.resolve( mockMessages ),
			} );

			const context = newMockStore( {
				commit: jest.fn(),
			} );

			actions[ MESSAGES_INIT ]( context, 'de' ).then( () => {
				expect( context.commit ).toBeCalledWith(
					MESSAGES_INIT_MUTATION,
					mockMessages,
				);
				done();
			} );
		} );
	} );
} );
