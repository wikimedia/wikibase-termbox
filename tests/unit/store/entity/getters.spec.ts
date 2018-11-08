import {
	filledEntity as entity,
	filledEntityType,
} from '../data/EntityStores';
import { getters } from '@/store/entity/getters';

describe( '/store/Entity/Getters.ts', () => {
	it( 'returns an id', () => {
		expect( getters.id( filledEntityType, null, null, null ) )
			.toMatch( entity.id );
	} );

	it( 'returns an type', () => {
		expect( getters.type( filledEntityType, null, null, null ) )
			.toMatch( entity.type );
	} );

	it( 'returns labels', () => {
		expect( getters.labels( filledEntityType, null, null, null ) )
			.toStrictEqual( entity.labels );
	} );

	it( 'returns descriptions', () => {
		expect( getters.labels( filledEntityType, null, null, null ) )
			.toStrictEqual( entity.labels );
	} );

	it( 'returns aliases', () => {
		expect( getters.labels( filledEntityType, null, null, null ) )
			.toStrictEqual( entity.labels );
	} );

	it( 'returns on label, refered by LanguagesCode', () => {
		expect(
			getters.getLabelByLanguage( filledEntityType, null, null, null )( 'de' ),
		).toMatch( entity.labels.de );
	} );

	it( 'return an empty string for a unknown LanguagesCode at labels', () => {
		expect(
			getters.getLabelByLanguage( filledEntityType, null, null, null )( 'whatEver' ),
		).toMatch( '' );
	} );

	it( 'returns on description, refered by LanguagesCode', () => {
		expect(
			getters.getDescriptionByLanguage( filledEntityType, null, null, null )( 'de' ),
		).toMatch( entity.descriptions.de );
	} );

	it( 'return an empty string for a unknown LanguagesCode at descriptions', () => {
		expect(
			getters.getDescriptionByLanguage( filledEntityType, null, null, null )( 'whatEver' ),
		).toMatch( '' );
	} );

	it( 'returns on aliases, refered by LanguagesCode', () => {
		expect(
			getters.getAliasesByLanguage( filledEntityType, null, null, null )( 'de' ),
		).toStrictEqual( entity.aliases.de );
	} );

	it( 'return an empty string for a unknown LanguagesCode at aliases', () => {
		expect(
			getters.getAliasesByLanguage( filledEntityType, null, null, null )( 'whatEver' ),
		).toStrictEqual( [] );
	} );
} );
