import ContextError from '@/common/error/ContextError';

export enum ErrorReason {
	EntityNotFound = 'EntityNotFound',
	LanguageNotFound = 'LanguageNotFound',
}

/**
 * This acts as a DTO to allow error information to pass the bundle-server-boundary
 */
export default class BundleBoundaryPassingException extends ContextError {
	public readonly reason: ErrorReason;

	public constructor( reason: ErrorReason, context: object ) {
		super( reason, context );
		this.reason = reason;
	}

}
