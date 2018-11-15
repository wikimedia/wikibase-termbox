export default class TechnicalProblem extends Error {
	constructor( m: string ) {
		super( m );
		Object.setPrototypeOf( this, TechnicalProblem.prototype );
	}
}
