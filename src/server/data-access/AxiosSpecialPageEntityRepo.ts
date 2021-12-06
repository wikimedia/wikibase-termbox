import EntityRepository from '@/common/data-access/EntityRepository';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityInitializerInterface from '@/common/EntityInitializerInterface';
import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { MEDIAWIKI_INDEX_SCRIPT } from '@/common/constants';
import { StatusCodes } from 'http-status-codes';
import AxiosTechnicalProblem from '@/common/data-access/error/AxiosTechnicalProblem';

export default class AxiosSpecialPageEntityRepo implements EntityRepository {
	public static readonly SPECIAL_PAGE = 'Special:EntityData';

	private axios: AxiosInstance;
	private entityInitializer: EntityInitializerInterface;

	public constructor(
		axios: AxiosInstance,
		entityInitializer: EntityInitializerInterface,
	) {
		this.axios = axios;
		this.entityInitializer = entityInitializer;
	}

	public getFingerprintableEntity( id: string, revision: number ): Promise<FingerprintableEntity> {
		return new Promise( ( resolve, reject ) => {
			this.getEntity( id, revision )
				.then( ( entity ) => {
					try {
						resolve( this.entityInitializer.newFromSerialization( entity ) );
					} catch ( e ) {
						reject( new TechnicalProblem( ( e as Error ).message ) );
					}
				} )
				.catch( ( reason ) => {
					reject( reason );
				} );
		} );
	}

	private getEntity( id: string, revision: number ): Promise<unknown> {
		return new Promise( ( resolve, reject ) => {
			this.axios.get( MEDIAWIKI_INDEX_SCRIPT, { params: {
				title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
				id,
				revision,
			} } )
				.then( ( response: AxiosResponse ) => {
					const data = response.data;

					if ( typeof data !== 'object' || !( 'entities' in data ) ) {
						reject( new TechnicalProblem( 'result not well formed.' ) );
						return;
					}

					if ( !( id in data.entities ) ) {
						reject( new EntityNotFound( 'result does not contain relevant entity.', {
							entity: id,
							revision,
						} ) );
						return;
					}

					resolve( data.entities[ id ] );
				} )
				.catch( ( error: AxiosError ) => {
					if ( error.response && error.response.status === StatusCodes.NOT_FOUND ) {
						reject( new EntityNotFound( 'Entity flagged missing in response.', {
							entity: id,
							revision,
						} ) );
						return;
					}
					reject( new AxiosTechnicalProblem( error ) );
				} );
		} );
	}
}
