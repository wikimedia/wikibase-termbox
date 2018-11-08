import EntityInitializer from '../../../src/common/EntityInitializer';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

function newEntityInitializer() {
	return new EntityInitializer();
}

describe( 'EntityInitializer', () => {

	it( 'throws an error given an invalid entity serialization', () => {
		[
			'not json',
			{},
			{ type: 'item' },
			{ id: 'Q123' },
		].forEach( ( serialization ) => {
			expect( () => {
				newEntityInitializer().newFromSerialization( serialization );
			} ).toThrow();
		} );
	} );

	it( 'initializes entity fields from json', () => {
		const entity = {
			id: 'Q123',
			type: 'item',
			labels: {
				en: { language: 'en', value: 'potato' },
			},
			descriptions: {
				en: { language: 'en', value: 'root vegetable' },
			},
			aliases: {
				en: [
					{ language: 'en', value: 'p0tato' },
					{ language: 'en', value: 'potat0' },
				],
			},
		};

		const result = newEntityInitializer()
			.newFromSerialization( entity );

		expect( result ).toBeInstanceOf( FingerprintableEntity );
		expect( result.id ).toBe( entity.id );
		expect( result.labels ).toEqual( entity.labels );
		expect( result.descriptions ).toEqual( entity.descriptions );
		expect( result.aliases ).toEqual( entity.aliases );
	} );

} );
