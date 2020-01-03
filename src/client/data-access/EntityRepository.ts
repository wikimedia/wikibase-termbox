import EntityRepositoryInterface from '@/common/data-access/EntityRepository';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityInitializerInterface from '@/common/EntityInitializerInterface';
import HookHandler from '@/client/mediawiki/HookHandler';

export default class EntityRepository implements EntityRepositoryInterface {

	private entityLoadedHook: HookHandler;
	private entityInitializer: EntityInitializerInterface;

	public constructor( entityLoadedHook: HookHandler, entityInitializer: EntityInitializerInterface ) {
		this.entityLoadedHook = entityLoadedHook;
		this.entityInitializer = entityInitializer;
	}

	public getFingerprintableEntity( _id: string, _revision: number ): Promise<FingerprintableEntity> {
		return new Promise( ( resolve ) => {
			this.entityLoadedHook.add( ( entity: unknown ) => {
				resolve( this.entityInitializer.newFromSerialization( entity ) );
			} );
		} );
	}

}
