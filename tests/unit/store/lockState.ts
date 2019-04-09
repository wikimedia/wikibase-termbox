export function lockState( state: any ): void {
	const keys = Object.keys( state );
	keys.forEach( ( key: string ): void => {
		if ( typeof state[ key ] === 'object' ) {
			lockState( state[ key ] );
		}
	} );

	Object.preventExtensions( state );
}
