import express from 'express';
import Metrics from './Metrics';

export default function reportResponseTimeMetrics( metrics: Metrics ) {
	return ( request: express.Request, response: express.Response, time: number ): void => {
		const normalizedPath = metrics.normalizeName(
			request.path.replace( /^\//, '' ) || 'root',
		);

		metrics.timing( [
			`${normalizedPath}.${request.method}.ALL`,
			`${normalizedPath}.${request.method}.${response.statusCode}`,
			`${normalizedPath}.${request.method}.${Math.floor( response.statusCode / 100 )}xx`,
		], time );
	};
}
