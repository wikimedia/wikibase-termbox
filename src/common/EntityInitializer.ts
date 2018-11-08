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
			!entity.hasOwnProperty( 'id' )
			|| !entity.hasOwnProperty( 'labels' )
			|| !entity.hasOwnProperty( 'descriptions' )
			|| !entity.hasOwnProperty( 'aliases' )
		) {
			throw new Error( 'invalid entity serialization' );
		}
	}
}
