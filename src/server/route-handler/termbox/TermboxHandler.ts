import QueryValidator from './QueryValidator';
import InvalidRequest from './error/InvalidRequest';
import TermboxRequest from '@/common/TermboxRequest';

export default class TermboxHandler {

	private queryValidator: QueryValidator;

	constructor( queryValidator: QueryValidator ) {
		this.queryValidator = queryValidator;
	}

	public createTermboxRequest( query: any ): Promise<TermboxRequest> {
		return new Promise( ( resolve, reject ) => {
			if ( !this.queryValidator.validate( query ) ) {
				reject(
					new InvalidRequest(
						'Request errors: ' + JSON.stringify( this.queryValidator.getErrors() ),
					),
				);
				return;
			}

			resolve(
				new TermboxRequest(
					query.language,
					query.entity,
					query.editLink,
				),
			);
		} );
	}

}
