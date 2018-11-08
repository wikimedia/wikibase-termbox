import { getters } from '@/store/entity/getters';
import Entity from '@/store/entity/Entity';

function newMinimalStore( fields: any ): Entity {
	return {
		id: 'Q1',
		labels: {},
		descriptions: {},
		aliases: {},
		...fields,
	} as Entity;
}

describe( 'entity/Getters', () => {

	it( 'has an id', () => {
		expect( getters.id( newMinimalStore( { id: 'Q123' } ), null, null, null ) )
			.toBe( 'Q123' );
	} );

	it( 'has labels', () => {
		const labels = { en: { language: 'en', value: 'potato' } };

		expect( getters.labels(
			newMinimalStore( { labels } ), null, null, null,
		) ).toBe( labels );
	} );

	it( 'has descriptions', () => {
		const descriptions = { en: { language: 'en', value: 'root vegetable' } };

		expect( getters.descriptions(
			newMinimalStore( { descriptions } ), null, null, null,
		) ).toBe( descriptions );
	} );

	it( 'has aliases', () => {
		const aliases = {
			en: [
				{ language: 'en', value: 'p0tato' },
				{ language: 'en', value: 'potat0' },
			],
		};
		expect( getters.aliases(
			newMinimalStore( { aliases } ), null, null, null,
		) ).toBe( aliases );
	} );

	describe( 'getLabelByLanguage', () => {

		it( 'returns the label for the given language', () => {
			const labels = {
				en: { language: 'en', value: 'potato' },
				de: { language: 'de', value: 'Kartoffel' },
			};

			expect( getters.getLabelByLanguage(
				newMinimalStore( { labels } ), null, null, null,
			)( 'de' ) ).toBe( labels.de );
		} );

		it( 'returns null if no label for the language exists', () => {
			const labels = {
				en: { language: 'en', value: 'potato' },
			};
			expect( getters.getLabelByLanguage(
				newMinimalStore( { labels } ), null, null, null,
			)( 'de' ) ).toBe( null );
		} );

	} );

	describe( 'getDescriptionByLanguage', () => {

		it( 'returns the description for the given language', () => {
			const descriptions = {
				en: { language: 'en', value: 'root vegetable' },
				de: { language: 'de', value: 'Nutzpflanze aus der Familie der Nachtschattengewächse' },
			};

			expect( getters.getDescriptionByLanguage(
				newMinimalStore( { descriptions } ), null, null, null,
			)( 'de' ) ).toBe( descriptions.de );
		} );

		it( 'returns null if no description for the language exists', () => {
			const descriptions = {
				en: { language: 'en', value: 'root vegetable' },
			};
			expect( getters.getDescriptionByLanguage(
				newMinimalStore( { descriptions } ), null, null, null,
			)( 'de' ) ).toBe( null );
		} );

	} );

	describe( 'getAliasesByLanguage', () => {

		it( 'returns the label for the given language', () => {
			const aliases = {
				de: [
					{ language: 'de', value: 'Erdapfel' },
					{ language: 'de', value: 'Erdbirne' },
					{ language: 'de', value: 'Potaten' },
				],
			};

			expect( getters.getAliasesByLanguage(
				newMinimalStore( { aliases } ), null, null, null,
			)( 'de' ) ).toBe( aliases.de );
		} );

		it( 'returns null if no aliases for the language exists', () => {
			const aliases = {
				en: [{ language: 'en', value: 'Solanum tuberosum' }],
			};
			expect( getters.getAliasesByLanguage(
				newMinimalStore( { aliases } ), null, null, null,
			)( 'de' ) ).toBe( null );
		} );

	} );

} );
