export default class InvalidRequest extends Error {
	constructor( m: string ) {
		super( m );
		Object.setPrototypeOf( this, InvalidRequest.prototype );
	}
}
