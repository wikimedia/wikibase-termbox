/**
 * Describes the metrics service provided by service runner, likely a statsd interface of sorts.
 * See https://github.com/wikimedia/service-runner/blob/master/lib/statsd.js#L29
 *     https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/statsd-client/index.d.ts#L115
 */
interface Metrics {

	timing( stat: string | string[], value: number ): void;

	/**
	 * Normalizes a string, e.g. a request path, to be a valid (statsd) metrics key
	 * See https://github.com/wikimedia/service-runner/blob/master/lib/statsd.js#L15
	 */
	normalizeName( name: string ): string;
}

export default Metrics;
