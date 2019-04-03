import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

export default class EntityInitializer {

	public newFromSerialization( entity: any ) {
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
			|| !entity.labels
			|| !entity.descriptions
			|| !entity.aliases
		) {
			throw new Error( 'invalid entity serialization' );
		}
	}
}
