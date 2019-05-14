import InvalidRequest from './error/InvalidRequest';
import TermboxRequest from '@/common/TermboxRequest';
import { IOpenAPIRequestValidator } from 'openapi-request-validator';
import { IOpenAPIRequestCoercer } from 'openapi-request-coercer';
import { OpenAPI } from 'openapi-types';

export default class TermboxHandler {

	private coercer: IOpenAPIRequestCoercer;
	private validator: IOpenAPIRequestValidator;

	constructor( coercer: IOpenAPIRequestCoercer, validator: IOpenAPIRequestValidator ) {
		this.coercer = coercer;
		this.validator = validator;
	}

	public createTermboxRequest( request: OpenAPI.Request ): Promise<TermboxRequest> {
		this.coercer.coerce( request );

		return new Promise( ( resolve, reject ) => {
			const rejection = this.validator.validate( request );
			if ( rejection ) {
				reject(
					new InvalidRequest(
						'Request errors', rejection.errors,
					),
				);
				return;
			}

			const query = request.query as any;
			resolve(
				new TermboxRequest(
					query.language,
					query.entity,
					query.revision,
					{
						editLinkUrl: query.editLink,

						// the following two are not relevant for the server-side markup
						signUpLinkUrl: '',
						loginLinkUrl: '',
					},
					query.preferredLanguages,
				),
			);
		} );
	}

}
