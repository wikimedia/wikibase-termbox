import InvalidRequest from './error/InvalidRequest';
import TermboxRequest from '@/common/TermboxRequest';
import { OpenAPI } from 'openapi-types';
import CoercingQueryValidator from './CoercingQueryValidator';

export default class TermboxHandler {

	private validator: CoercingQueryValidator;

	public constructor( validator: CoercingQueryValidator ) {
		this.validator = validator;
	}

	public createTermboxRequest( request: OpenAPI.Request ): Promise<TermboxRequest> {
		return new Promise( ( resolve, reject ) => {
			const rejection = this.validator.coerceAndValidate( request );
			if ( rejection ) {
				reject( new InvalidRequest( rejection.errors ) );
				return;
			}

			const query = request.query as {
				language: string;
				entity: string;
				revision: number;
				editLink: string;
				preferredLanguages: string[];
			};
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
