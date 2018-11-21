import EntityRepositoryInterface from '@/common/data-access/EntityRepository';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import MwWindow from '@/client/MwWindow';
import EntityInitializer from '@/common/EntityInitializer';

export default class EntityRepository implements EntityRepositoryInterface {

	public getFingerprintableEntity( id: string ): Promise<FingerprintableEntity> {
		return new Promise( ( resolve ) => {
			( window as MwWindow ).mw.hook( 'wikibase.entityPage.entityLoaded' ).add( ( entity: any ) => {
				resolve( ( new EntityInitializer() ).newFromSerialization( entity ) );
			} );
		} );
	}

}
