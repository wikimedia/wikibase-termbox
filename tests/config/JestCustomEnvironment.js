const JSDOMEnvironment = require( 'jest-environment-jsdom' ).TestEnvironment;

class JestCustomEnvironment extends JSDOMEnvironment {
	constructor( config, context ) {
		if ( !( 'projectConfig' in config ) ) {
			// for some reason, we are sometimes called with
			// { projectConfig: { transform, clearMocks, ... } }
			// and sometimes with
			// { transform, clearMocks, ... }
			// directly, seemingly depending on whether `npm run build-server` ran first;
			// jest-environment-jsdom needs the former form, so cast if necessary :/
			config = { projectConfig: config };
		}
		super( config, context );
		Object.assign( context.console, {
			error( ...args ) {
				throw new Error(
					`Unexpected call of console.error() with:\n\n${args.join( ', ' )}`,
					this.error,
				);
			},

			warn( ...args ) {
				throw new Error(
					`Unexpected call of console.warn() with:\n\n${args.join( ', ' )}`,
					this.warn,
				);
			},
		} );
		// Jest v27+ jsdom removes these globals but bundle-runnenr needs them to exist
		this.global.setImmediate = function () {
			throw new Error( 'Unexpected call of setImmediate()' );
		};
		this.global.clearImmediate = function () {
			throw new Error( 'Unexpected call of clearImmediate()' );
		};
	}
}

module.exports = JestCustomEnvironment;
