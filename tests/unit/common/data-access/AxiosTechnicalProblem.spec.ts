import AxiosTechnicalProblem from '@/common/data-access/error/AxiosTechnicalProblem';

describe( 'AxiosTechnicalProblem', () => {

	it( 'builds the error context from AxiosError', () => {
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
			config: {},
			request: {
				_headers: testRequestHeaders,
				path: testPath,
			},
			response: {
				status: testStatus,
				statusText: testStatusText,
				config: {},
				headers: testResponseHeaders,
				data: testData,
			},
		};

		expect( ( new AxiosTechnicalProblem( mockError ) ).getContext() ).toEqual( {
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
