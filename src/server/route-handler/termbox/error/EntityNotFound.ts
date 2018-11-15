export default class EntityNotFound extends Error {
	constructor( m: string ) {
		super( m );
		Object.setPrototypeOf( this, EntityNotFound.prototype );
	}
}
