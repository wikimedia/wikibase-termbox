import Dictionary from '@/common/interfaces/Dictionary';
import EntityClass from '@/common/Entity';
import InvalidRawEntityException from '@/store/entity/exceptions/InvalidRawEntityException';

export default class EntityInitializer {

	public static initializeEntity( entity: any ) {
		if ( typeof entity === 'string' ) {
			entity = JSON.parse( entity );
		}

		EntityInitializer.unstrippedEntity = entity;
		EntityInitializer.validateEntity();
		return new EntityClass(
			EntityInitializer.getId(),
			EntityInitializer.getType(),
			EntityInitializer.getLabels(),
			EntityInitializer.getDescriptions(),
			EntityInitializer.getAliases(),
		);
	}

	private static unstrippedEntity: any;

	private static getId(): string {
		return EntityInitializer.unstrippedEntity.id;
	}

	private static getType(): 'item' | 'property' {
		return EntityInitializer.unstrippedEntity.type;
	}

	private static getLabels(): Dictionary<string> {
		return EntityInitializer.getNestedLabels();
	}

	private static getDescriptions(): Dictionary<string> {
		return EntityInitializer.getNesatedDescriptions();
	}

	private static getAliases(): Dictionary<string[]> {
		return EntityInitializer.getNestedAliases( EntityInitializer.unstrippedEntity );
	}

	private static getNestedValues( entityObject: any, index: string ): Dictionary<string> {
		const value: Dictionary<string> = {};

		if ( !entityObject.hasOwnProperty( index ) ) {
			return value;
		}
		Object.keys( entityObject[ index ] ).forEach( ( languageKey: string ) => {
			value[ languageKey ] = entityObject[ index ][ languageKey ].value;
		} );

		return value;
	}

	private static getNestedLabels(): Dictionary<string> {
		return EntityInitializer.getNestedValues( EntityInitializer.unstrippedEntity, 'labels' );
	}

	private static getNesatedDescriptions(): Dictionary<string> {
		return EntityInitializer.getNestedValues( EntityInitializer.unstrippedEntity, 'descriptions' );
	}

	private static validateEntity(): void {
		if ( !EntityInitializer.unstrippedEntity.hasOwnProperty( 'id' ) ) {
			throw new InvalidRawEntityException( 'Missing entityid' );
		}

		if ( typeof EntityInitializer.unstrippedEntity.id !== 'string' ) {
			throw new InvalidRawEntityException( 'Unsupported type of entityid' );
		}

		if ( EntityInitializer.unstrippedEntity.id.length === 0 ) {
			throw new InvalidRawEntityException( 'Missing entityid' );
		}

		if ( !EntityInitializer.unstrippedEntity.hasOwnProperty( 'type' ) ) {
			throw new InvalidRawEntityException( `Missing type on entiy ${EntityInitializer.unstrippedEntity.id}` );
		}

		if ( typeof EntityInitializer.unstrippedEntity.type !== 'string' ) {
			throw new InvalidRawEntityException( 'Unsupported type of entitytype' );
		}

		if ( EntityInitializer.unstrippedEntity.type.length === 0 ) {
			throw new InvalidRawEntityException( `Missing type on entity ${EntityInitializer.unstrippedEntity.id}` );
		}
	}

	private static getNestedAliases( entityObject: any ): Dictionary<string[]> {
		const aliases: Dictionary<string[]>  = {};
		let subEntries: string[];
		if ( !entityObject.hasOwnProperty( 'aliases' ) || entityObject.aliases.length === 0 ) {
			return aliases;
		}

		Object.keys( entityObject.aliases ).forEach( ( languageKey: string ) => {
			subEntries = [];
			entityObject.aliases[ languageKey ].forEach( ( value: any ) => {
				subEntries.push( value.value );
			} );

			aliases[ languageKey ] = subEntries;
		} );

		return aliases;
	}
}
