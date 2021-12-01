const JSDOMEnvironment = require( 'jest-environment-jsdom' );

class JestCustomEnvironment extends JSDOMEnvironment {
	constructor( config, context ) {
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
