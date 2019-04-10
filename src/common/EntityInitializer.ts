import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

export default class EntityInitializer {

	public newFromSerialization( entity: any ) {
		this.repairEmptyArrays( entity );
		this.validate( entity );

		return new FingerprintableEntity(
			entity.id,
			entity.labels,
			entity.descriptions,
			entity.aliases,
		);
	}

	private validate( entity: any ) {
		if (
			!entity.id
			|| this.notObject( entity.labels )
			|| this.notObject( entity.descriptions )
			|| this.notObject( entity.aliases )
		) {
			throw new Error( 'invalid entity serialization' );
		}
	}

	private notObject( field: any ) {
		return !field || typeof field !== 'object' || Array.isArray( field );
	}

	/**
	 * This method exists because we're often dealing with entities serialized in PHP,
	 * which does not do a good job at guessing whether [] is an array (list) or an object.
	 */
	private emptyArrayToEmptyObject( field: any ) {
		if ( Array.isArray( field ) && field.length === 0 ) {
			return {};
		}

		return field;
	}

	private repairEmptyArrays( entity: any ) {
		entity.labels = this.emptyArrayToEmptyObject( entity.labels );
		entity.descriptions = this.emptyArrayToEmptyObject( entity.descriptions );
		entity.aliases = this.emptyArrayToEmptyObject( entity.aliases );
	}
}
