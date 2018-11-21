import EntityRepository from '@/common/data-access/EntityRepository';
import mwbot from 'mwbot';
import TechnicalProblem from '@/server/data-access/error/TechnicalProblem';
import EntityNotFound from '@/server/data-access/error/EntityNotFound';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityInitializer from '@/common/EntityInitializer';

export default class MwBotWikibaseRepo implements EntityRepository {
	private bot: mwbot;
	private entityInitializer: EntityInitializer;

	public constructor( bot: mwbot, entityInitializer: EntityInitializer ) {
		this.bot = bot;
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
			this.bot.request( {
				ids: id,
				action: 'wbgetentities',
			} )
				.then( ( response: any ) => {
					if ( !( 'entities' in response ) ) {
						reject( new TechnicalProblem( 'wbgetentities result not well formed.' ) );
					}

					if ( !( id in response.entities ) ) {
						reject( new EntityNotFound( 'wbgetentities result does not contain relevant entity.' ) );
					}

					const entity = response.entities[ id ];

					if ( 'missing' in entity ) {
						reject( new EntityNotFound( 'Entity flagged missing in response.' ) );
					}

					resolve( entity );
				} )
				.catch( ( reason: string ) => {
					reject( new TechnicalProblem( reason ) );
				} );
		} );
	}
}
