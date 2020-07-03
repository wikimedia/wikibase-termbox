import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityInitializerInterface from './EntityInitializerInterface';
import { Fingerprintable } from '@wmde/wikibase-datamodel-types';

export default class EntityInitializer implements EntityInitializerInterface {

	public newFromSerialization( entity: unknown ): FingerprintableEntity {
		entity = this.deepClone( entity );

		this.repairEmptyArrays( entity as Fingerprintable );
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

	/**
	 * This method exists because we're often dealing with entities serialized in PHP,
	 * which does not do a good job at guessing whether [] is an array (list) or an object.
	 */
	private emptyArrayToEmptyObject<T>( field: T ): T | {} {
		if ( Array.isArray( field ) && field.length === 0 ) {
			return {};
		}

		return field;
	}

	private deepClone<T>( original: T ): T {
		return JSON.parse( JSON.stringify( original ) );
	}

	private repairEmptyArrays( entity: Fingerprintable ): void {
		entity.labels = this.emptyArrayToEmptyObject( entity.labels );
		entity.descriptions = this.emptyArrayToEmptyObject( entity.descriptions );
		entity.aliases = this.emptyArrayToEmptyObject( entity.aliases );
	}
}
