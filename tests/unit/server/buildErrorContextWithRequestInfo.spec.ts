import { buildErrorContextWithRequestInfo } from '@/server/buildErrorContextWithRequestInfo';
import { Request } from 'express';
import LoggableError from '@/common/error/LoggableError';

function newLoggableError( context: object ): LoggableError {
	return {
		getContext: () => context,
	};
}

describe( 'buildErrorContextWithRequestInfo', () => {

	it( 'adds the URL to the error context', () => {
		const req = {
			url: '/termbox',
			header: ( _name: string ) => undefined,
		} as Request;
		const originalErrorContext = {
			message: 'sadness',
		};

		const errorContext = buildErrorContextWithRequestInfo(
			newLoggableError( originalErrorContext ),
			req,
		);

		expect( errorContext ).toMatchObject( originalErrorContext );
		expect( errorContext ).toHaveProperty( 'url', req.url );
	} );

	it( 'adds the request to the error context', () => {
		const reqId = 'some-req-id';
		const req = {
			url: '/termbox',
			header: jest.fn().mockReturnValueOnce( reqId ) as any,
		} as Request;

		const originalErrorContext = {
			message: 'sadness',
		};

		const errorContext = buildErrorContextWithRequestInfo(
			newLoggableError( originalErrorContext ),
			req,
		);

		expect( errorContext ).toMatchObject( originalErrorContext );
		expect( errorContext ).toHaveProperty( 'reqId', reqId );
		expect( req.header ).toHaveBeenCalledWith( 'X-Request-Id' );
	} );

} );
