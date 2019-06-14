import AxiosErrorLogger from '@/server/axios/AxiosErrorLogger';
import { AxiosError, AxiosRequestConfig } from 'axios';

describe( 'AxiosErrorLogger', () => {
	it( 'writes to the provided logger', () => {

		const testErrorMessage = 'A test error message';
		const testRequestHeaders = { Host: 'wiki.example.com' };
		const testPath = '/path/test';
		const testStatus = 1234;
		const testStatusText = 'foo';
		const testResponseHeaders = { SomeHeader: 'goat' };
		const testData = 'foo';
		const mockError = {
			name: 'mockError',
			message: testErrorMessage,
			config: jest.fn() as any as AxiosRequestConfig,
			request: {
				_headers: testRequestHeaders,
				path: testPath,
			},
			response: {
				status: testStatus,
				statusText: testStatusText,
				config: jest.fn() as any as AxiosRequestConfig,
				headers: testResponseHeaders,
				data: testData,
			},
		} as AxiosError;
		const providedLogger = {
			log: jest.fn(),
		};
		const logger = new AxiosErrorLogger( providedLogger, 'error/service' );

		logger.log( mockError );

		expect( providedLogger.log ).toBeCalledWith( 'error/service', {
			message: testErrorMessage,
			request: {
				headers: testRequestHeaders,
				path: testPath,
			},
			response: {
				status: testStatus,
				statusText: testStatusText,
				headers: testResponseHeaders,
				data: testData,
			},
		} );
	} );
} );
