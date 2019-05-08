import { Config } from './ServiceRunnerOptions';
import Logger from './Logger';

interface Spec {
	[ index: string ]: {
		fallback?: any,
	}
}

export default function ( spec: Spec, config: { [ index: string ]: any }, logger: Logger ): Config {
	const result: any = {};

	Object.keys( spec ).forEach( ( name ) => {
		let value = config[ name ];
		const fallback = spec[ name ].fallback;

		if ( typeof value === 'undefined' || value === '' ) {
			if ( typeof fallback === 'undefined' ) {
				logger.log( 'fatal/service', `${name} env must be configured to a meaningful value. Exiting.` );
				process.exit( 1 );
			}

			value = fallback;
		}

		if ( !isNaN( value ) ) {
			value = parseInt( value );
		}

		result[ name ] = value;

		logger.log( 'info/service', `Set ${name} to ${value}` );
	} );

	return result;
}
