import EntityRepository from '@/common/data-access/EntityRepository';
import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityInitializer from '@/common/EntityInitializer';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';

export default class AxiosWikibaseFingerprintableEntityRepo implements EntityRepository {
	private axios: AxiosInstance;
	private entityInitializer: EntityInitializer;

	public constructor( axios: AxiosInstance, entityInitializer: EntityInitializer ) {
		this.axios = axios;
		this.entityInitializer = entityInitializer;
	}

	public getFingerprintableEntity( id: string ): Promise<FingerprintableEntity> {
		return new Promise( ( resolve, reject ) => {
			this.getEntity( id )
				.then( ( entity: any ) => {
					try {
						resolve ( this.entityInitializer.newFromSerialization( entity ) );
					} catch ( e ) {
						reject( new TechnicalProblem( e.message ) );
					}
				} )
				.catch( ( reason ) => {
					reject( reason );
				} );
		} );
	}

	private getEntity( id: string ): Promise<any> {
		return new Promise( ( resolve, reject ) => {
			this.axios.get( MEDIAWIKI_API_SCRIPT, { params: {
				ids: id,
				action: 'wbgetentities',
			} } )
				.then( ( response: AxiosResponse ) => {
					const data = response.data;

					if ( typeof data !== 'object' || !( 'entities' in data ) ) {
						reject( new TechnicalProblem( 'wbgetentities result not well formed.' ) );
					}

					if ( !( id in data.entities ) ) {
						reject( new EntityNotFound( 'wbgetentities result does not contain relevant entity.' ) );
					}

					const entity = data.entities[ id ];

					if ( 'missing' in entity ) {
						reject( new EntityNotFound( 'Entity flagged missing in response.' ) );
					}

					resolve( entity );
				} )
				.catch( ( error: AxiosError ) => {
					reject( new TechnicalProblem( error.toString() ) );
				} );
		} );
	}
}
