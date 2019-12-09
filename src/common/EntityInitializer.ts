import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityInitializerInterface from './EntityInitializerInterface';

export default class EntityInitializer implements EntityInitializerInterface {

	public newFromSerialization( entity: unknown ): FingerprintableEntity {
		entity = this.deepClone( entity );

		if ( !this.isFingerprintableEntity( entity ) ) {
			throw new Error( 'invalid entity serialization' );
		}

		return new FingerprintableEntity(
			entity.id,
			entity.labels,
			entity.descriptions,
			entity.aliases,
		);
	}

	private isFingerprintableEntity( entity: unknown ): entity is FingerprintableEntity {
		return this.isObject( entity ) &&
			!!entity.id &&
			this.isObject( entity.labels ) &&
			this.isObject( entity.descriptions ) &&
			this.isObject( entity.aliases );
	}

	private isObject( value: unknown ): value is { [ key: string ]: unknown } {
		return !!value && typeof value === 'object' && !Array.isArray( value );
	}

	private deepClone<T>( original: T ): T {
		return JSON.parse( JSON.stringify( original ) );
	}
}
