import express from 'express';
import Metrics from './Metrics';

export default function reportResponseTimeMetrics( metrics: Metrics ) {
	return ( request: express.Request, response: express.Response, time: number ) => {
		const normalizedPath = metrics.normalizeName( request.path );

		metrics.timing( [
			`${ normalizedPath }.${ request.method }.ALL`,
			`${ normalizedPath }.${ request.method }.${ response.statusCode }`,
			`${ normalizedPath }.${ request.method }.${ Math.floor( response.statusCode / 100 ) }xx`,
		], time );
	};
}
