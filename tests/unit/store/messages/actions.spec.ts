import { actions } from '@/store/messages/actions';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import { MESSAGES_INIT as MESSAGES_INIT_MUTATION } from '@/store/messages/mutationTypes';
import { factory } from '@/common/TermboxFactory';
import MessagesRepository from '@/common/data-access/MessagesRepository';

describe( 'entity/actions', () => {
	describe( MESSAGES_INIT, () => {
		it( `commits to ${MESSAGES_INIT_MUTATION}`, ( done ) => {

			const mockMessages = {
				de: {
					test1: 'test',
					test2: 'teststring with spaces',
				},
			};

			factory.setMessagesRepository( {
				getMessagesInLanguage: ( inLanguage: string ) => {
					return Promise.resolve( mockMessages );
				},
			} as MessagesRepository );

			const context = {
				commit: jest.fn(),
			};

			const action = actions[ MESSAGES_INIT ] as any;

			action( context, 'de' ).then( ( code: string ) => {
				expect( context.commit ).toBeCalledWith(
					MESSAGES_INIT_MUTATION,
					mockMessages,
				);
				done();
			} );
		} );
	} );
} );
