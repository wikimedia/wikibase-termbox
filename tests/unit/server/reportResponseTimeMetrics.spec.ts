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

		reportRequest( { path: '/termbox' } as any, new ( jest.fn() )(), responseTime );

		expect( metrics.timing ).toHaveBeenCalledWith( expect.anything(), responseTime );
	} );

	it( 'reports per normalized path name, with status code, status class, and aggregate', () => {
		const request = {
			path: '/term/box',
			method: 'get',
		};
		const response = {
			statusCode: 200,
		};
		const metrics = mockMetricsService();
		const normalizedPath = 'term/box';
		const statName = 'term_box';
		metrics.normalizeName.mockReturnValue( statName );
		const reportRequest = reportResponseTimeMetrics( metrics );

		reportRequest( request as any, response as any, 123 );

		expect( metrics.normalizeName ).toHaveBeenCalledWith( normalizedPath );

		const stats = metrics.timing.mock.calls[ 0 ][ 0 ];
		expect( stats ).toContain( `${statName}.${request.method}.ALL` );
		expect( stats ).toContain( `${statName}.${request.method}.${response.statusCode}` );
		expect( stats ).toContain( `${statName}.${request.method}.2xx` );
	} );

	it.each( [
		[ '/termbox', 'termbox' ],
		[ '/', 'root' ],
	] )( 'normalizes path %s to stat %s', ( path, stat ) => {
		const metrics = mockMetricsService();
		const reportRequest = reportResponseTimeMetrics( metrics );

		reportRequest( {
			path,
			method: 'get',
		} as any, new ( jest.fn() )(), 123 );

		expect( metrics.normalizeName ).toHaveBeenCalledWith( stat );
	} );

} );
