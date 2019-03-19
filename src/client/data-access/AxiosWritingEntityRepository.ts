import WritingEntityRepository from '@/common/data-access/WritingEntityRepository';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';

export default class AxiosWritingEntityRepository implements WritingEntityRepository {
	private axios: AxiosInstance;

	public constructor( axios: AxiosInstance ) {
		this.axios = axios;
	}

	public saveEntity( entity: FingerprintableEntity, baseRevId: number ): Promise<void> {
		return new Promise( ( resolve, reject ) => {
			this.axios.post( MEDIAWIKI_API_SCRIPT, {
				action: 'wbeditentity',
				id: entity.id,
				// baserevid: baseRevId,
				data: JSON.stringify( {
					labels: entity.labels,
					descriptions: entity.descriptions,
					aliases: entity.aliases,
				} ),
			} ).then( ( response: AxiosResponse ) => {
				if ( !response.data.success ) {
					reject( new TechnicalProblem( response.data ) );
				}

				resolve(); // TODO resolve with latest entity revision
			} ).catch( ( error: AxiosError ) => {
				reject( new TechnicalProblem( error.toString() ) );
			} );
		} );
	}

}
