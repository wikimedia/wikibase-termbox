import AxiosTechnicalProblem from '@/common/data-access/error/AxiosTechnicalProblem';
import { AxiosError } from 'axios';

describe( 'AxiosTechnicalProblem', () => {

	it( 'builds the error context from AxiosError', () => {
		const testErrorMessage = 'A test error message';
		const testRequestHeaders = { Host: 'wiki.example.com' };
		const testUrl = 'https://some/wiki/api.php';
		const testParams = { action: 'yes' };
		const testStatus = 1234;
		const testStatusText = 'foo';
		const testResponseHeaders = { SomeHeader: 'goat' };
		const testData = 'foo';
		const mockError: AxiosError = {
			name: 'mockError',
			message: testErrorMessage,
			config: {
				headers: testRequestHeaders,
				url: testUrl,
				params: testParams,
			},
			request: {},
			response: {
				status: testStatus,
				statusText: testStatusText,
				config: {},
				headers: testResponseHeaders,
				data: testData,
			},
			isAxiosError: true,
			toJSON: jest.fn(),
		};

		expect( ( new AxiosTechnicalProblem( mockError ) ).getContext() ).toEqual( {
			message: testErrorMessage,
			request: {
				headers: testRequestHeaders,
				url: testUrl,
				params: testParams,
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
