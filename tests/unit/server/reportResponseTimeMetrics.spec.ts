import reportResponseTimeMetrics from '@/server/reportResponseTimeMetrics';

function mockMetricsService() {
	return {
		timing: jest.fn(),
		normalizeName: jest.fn(),
	};
}

describe( 'reportResponseTimeMetrics', () => {

	it( 'reports the response time to the metrics service', () => {
		const metrics = mockMetricsService();
		const reportRequest = reportResponseTimeMetrics( metrics );
		const responseTime = 100;

		reportRequest( new ( jest.fn() )(), new ( jest.fn() )(), responseTime );

		expect( metrics.timing ).toHaveBeenCalledWith( expect.anything(), responseTime );
	} );

	it( 'reports per normalized path name, with status code, status class, and aggregate', () => {
		const request = {
			path: '/termbox',
			method: 'get',
		};
		const response = {
			statusCode: 200,
		};
		const metrics = mockMetricsService();
		const normalizedPath = 'termbox';
		metrics.normalizeName.mockReturnValue( normalizedPath );
		const reportRequest = reportResponseTimeMetrics( metrics );

		reportRequest( request as any, response as any, 123 );

		expect( metrics.normalizeName ).toHaveBeenCalledWith( request.path );

		const stats = metrics.timing.mock.calls[ 0 ][ 0 ];
		expect( stats ).toContain( `${ normalizedPath }.${ request.method }.ALL` );
		expect( stats ).toContain( `${ normalizedPath }.${ request.method }.${ response.statusCode }` );
		expect( stats ).toContain( `${ normalizedPath }.${ request.method }.2xx` );
	} );

} );
