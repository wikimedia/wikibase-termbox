import EntityInitializer from '@/common/EntityInitializer';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

function newEntityInitializer() {
	return new EntityInitializer();
}

describe( 'EntityInitializer', () => {

	test.each( [
		[ 'not json' ],
		[ {} ],
		[ { type: 'item' } ],
		[ { id: 'Q123' } ],
		[ { id: 'Q123', labels: [ 'wat' ], descriptions: {}, aliases: {} } ],
		[ { id: 'Q123', labels: {}, descriptions: [ 'wat' ], aliases: {} } ],
		[ { id: 'Q123', labels: {}, descriptions: {}, aliases: [ 'wat' ] } ],
	] )(
		'throws an error given an invalid entity serialization',
		( serialization ) => {
			expect( () => {
				newEntityInitializer().newFromSerialization( serialization );
			} ).toThrow();
		},
	);

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
