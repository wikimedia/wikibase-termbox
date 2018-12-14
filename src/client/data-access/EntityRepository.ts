import EntityRepositoryInterface from '@/common/data-access/EntityRepository';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityInitializer from '@/common/EntityInitializer';
import HookHandler from '@/client/mediawiki/HookHandler';

export default class EntityRepository implements EntityRepositoryInterface {

	private entityLoadedHook: HookHandler;

	public constructor( entityLoadedHook: HookHandler ) {
		this.entityLoadedHook = entityLoadedHook;
	}

	public getFingerprintableEntity( id: string ): Promise<FingerprintableEntity> {
		return new Promise( ( resolve ) => {
			this.entityLoadedHook.add( ( entity: any ) => {
				resolve( ( new EntityInitializer() ).newFromSerialization( entity ) );
			} );
		} );
	}

}
