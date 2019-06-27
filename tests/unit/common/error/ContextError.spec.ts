import ContextError from '@/common/error/ContextError';

describe( 'ContextError', () => {

	describe( 'getContext', () => {

		it( 'contains the message given no context', () => {
			const message = 'things went haywire';
			expect( ( new ContextError( message ) ).getContext() ).toEqual( { message } );
		} );

		it( 'returns the context when present, including the message', () => {
			const context = { foo: 'bar' };
			const message = 'computer not feeling well';
			expect( ( new ContextError( message, context ) ).getContext() ).toEqual( { ...context, message } );
		} );

	} );

} );
