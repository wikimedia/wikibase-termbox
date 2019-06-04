import WritingEntityRepository from '@/common/data-access/WritingEntityRepository';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import EntityRevision from '@/datamodel/EntityRevision';
import EntityInitializerInterface from '@/common/EntityInitializerInterface';

export default class AxiosWritingEntityRepository implements WritingEntityRepository {
	private axios: AxiosInstance;
	private entityInitializer: EntityInitializerInterface;

	public constructor( axios: AxiosInstance, entityInitializer: EntityInitializerInterface ) {
		this.axios = axios;
		this.entityInitializer = entityInitializer;
	}

	public saveEntity( entity: FingerprintableEntity, baseRevId: number ): Promise<EntityRevision> {
		return new Promise( ( resolve, reject ) => {
			this.axios.post( MEDIAWIKI_API_SCRIPT, {
				action: 'wbeditentity',
				id: entity.id,
				baserevid: baseRevId,
				data: JSON.stringify( {
					labels: entity.labels,
					descriptions: entity.descriptions,
					aliases: entity.aliases,
				} ),
			} ).then( ( response: AxiosResponse ) => {
				if ( !response.data.success ) {
					reject( new TechnicalProblem( response.data ) );
				}

				try {
					resolve( new EntityRevision(
						this.entityInitializer.newFromSerialization( response.data.entity ),
						response.data.entity.lastrevid,
					) );
				} catch ( e ) {
					reject( new TechnicalProblem( e.toString() ) );
				}
			} ).catch( ( error: AxiosError ) => {
				reject( new TechnicalProblem( error.toString() ) );
			} );
		} );
	}

}
