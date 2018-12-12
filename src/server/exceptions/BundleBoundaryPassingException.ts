export enum ErrorReason {
	EntityNotFound = 'EntityNotFound',
	LanguageNotFound = 'LanguageNotFound',
}

/**
 * This acts as a DTO to allow error information to pass the bundle-server-boundary
 */
export default class BundleBoundaryPassingException {
	public readonly reason: ErrorReason;

	constructor( reason: ErrorReason ) {
		this.reason = reason;
	}

}
