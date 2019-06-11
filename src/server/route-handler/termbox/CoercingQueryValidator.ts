import { IOpenAPIRequestCoercer } from 'openapi-request-coercer';
import { IOpenAPIRequestValidator } from 'openapi-request-validator';
import { OpenAPI } from 'openapi-types';

export default class CoercingQueryValidator {

	private coercer: IOpenAPIRequestCoercer;
	private validator: IOpenAPIRequestValidator;

	public constructor( coercer: IOpenAPIRequestCoercer, validator: IOpenAPIRequestValidator ) {
		this.coercer = coercer;
		this.validator = validator;
	}

	public coerceAndValidate( request: OpenAPI.Request ) {
		this.coercer.coerce( request );
		return this.validator.validate( request );
	}

}
