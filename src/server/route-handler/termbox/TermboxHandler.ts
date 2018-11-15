import TermboxRequest from '@/common/TermboxRequest';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import WikibaseRepo from '@/server/data-access/WikibaseRepo';
import ApiEntityNotFound from '@/server/data-access/error/EntityNotFound';
import EntityNotFound from './error/EntityNotFound';
import InvalidRequest from './error/InvalidRequest';
import TechnicalProblem from './error/TechnicalProblem';
import QueryValidator from './QueryValidator';

export default class TermboxHandler {

	private repo: WikibaseRepo;
	private queryValidator: QueryValidator;

	constructor( queryValidator: QueryValidator, repo: WikibaseRepo ) {
		this.queryValidator = queryValidator;
		this.repo = repo;
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

			const language = query.language;
			const entityId = query.entity;

			this.repo.getFingerprintableEntity( entityId )
				.then( ( entity: FingerprintableEntity ) => {
					resolve(
						new TermboxRequest(
							language,
							entity,
						),
					);
				} )
				.catch( ( reason: Error ) => {
					if ( reason instanceof ApiEntityNotFound ) {
						reject( new EntityNotFound( reason.message ) );
					} else {
						reject( new TechnicalProblem( reason.message ) );
					}
				} );
		} );
	}

}
