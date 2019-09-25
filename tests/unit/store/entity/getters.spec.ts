import { getters } from '@/store/entity/getters';
import EntityState from '@/store/entity/EntityState';

function newMinimalStore( fields: any ): EntityState {
	return {
		id: 'Q1',
		labels: {},
		descriptions: {},
		aliases: {},
		...fields,
	};
}

describe( 'entity/Getters', () => {

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
				en: [ { language: 'en', value: 'Solanum tuberosum' } ],
			};
			expect( getters.getAliasesByLanguage(
				newMinimalStore( { aliases } ), null, null, null,
			)( 'de' ) ).toBe( null );
		} );
	} );

	describe( 'getAllEnteredLanguageCodes', () => {
		it( 'returns all entered language-codes on an entity ordered by language code', () => {
			const labels = {
				de: 'irgendwas',
				it: 'qualcosa',
			};
			const descriptions = {
				'zh-hk': '別的',
				'de-sb': 'irgendwas',
				'de': 'irgendwas',
				'en': 'something somting',
				'zh': '别的',
				'zh-tw': '別的',
				'de-au': 'irgendwas',
			};
			const aliases = {
				pl: [ { language: 'pl', value: 'coś' } ],
				fr: [ { language: 'fr', value: 'quelque chose' } ],
			};

			expect( getters.getAllEnteredLanguageCodes(
				newMinimalStore( { labels, descriptions, aliases } ), null, null, null,
			) ).toStrictEqual( [ 'de', 'de-au', 'de-sb', 'en', 'fr', 'it', 'pl', 'zh', 'zh-hk', 'zh-tw' ] );
		} );
	} );
} );
