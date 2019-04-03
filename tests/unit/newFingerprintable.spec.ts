import newFingerprintable from '../newFingerprintable';

describe( 'newFingerprintable', () => {

	describe( 'id', () => {
		it( 'is set to Q1 by default', () => {
			const entity = newFingerprintable( {} );
			expect( entity.id ).toBe( 'Q1' );
		} );

		it( 'is set as passed', () => {
			const id = 'Q4711';
			const entity = newFingerprintable( { id } );
			expect( entity.id ).toBe( id );
		} );
	} );

	describe( 'labels', () => {
		it( 'does not have a usable default', () => {
			const entity = newFingerprintable( {} );
			expect( entity.labels ).toEqual( {} );
		} );

		it( 'are set as passed', () => {
			const entity = newFingerprintable( { labels: { de: 'foo' } } );
			expect( entity.labels.de.language ).toBe( 'de' );
			expect( entity.labels.de.value ).toBe( 'foo' );
		} );
	} );

	describe( 'descriptions', () => {
		it( 'do not have a usable default', () => {
			const entity = newFingerprintable( {} );
			expect( entity.descriptions ).toEqual( {} );
		} );

		it( 'are set as passed', () => {
			const entity = newFingerprintable( { descriptions: { en: 'bar' } } );
			expect( entity.descriptions.en.language ).toBe( 'en' );
			expect( entity.descriptions.en.value ).toBe( 'bar' );
		} );
	} );

	describe( 'aliases', () => {
		it( 'do not have a usable default', () => {
			const entity = newFingerprintable( {} );
			expect( entity.aliases ).toEqual( {} );
		} );

		it( 'are set as passed', () => {
			const entity = newFingerprintable( { aliases: { en: [ 'baz', 'lorem' ] } } );
			expect( entity.aliases.en[ 0 ].language ).toBe( 'en' );
			expect( entity.aliases.en[ 0 ].value ).toBe( 'baz' );
			expect( entity.aliases.en[ 1 ].language ).toBe( 'en' );
			expect( entity.aliases.en[ 1 ].value ).toBe( 'lorem' );
		} );
	} );

} );
