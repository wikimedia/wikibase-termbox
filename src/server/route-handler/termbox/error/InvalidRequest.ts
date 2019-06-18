import ContextError from '@/common/error/ContextError';
import { OpenAPIRequestValidatorError } from 'openapi-request-validator';

export default class InvalidRequest extends ContextError {
	public constructor( errors: OpenAPIRequestValidatorError[] ) {
		super( 'Request errors', { errors } );
	}
}
