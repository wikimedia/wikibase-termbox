import newFingerprintable from '../../newFingerprintable';
import EntityRevision from '@/datamodel/EntityRevision';

describe( 'EntityRevision', () => {

	it( 'holds an entity', () => {
		const entity = newFingerprintable( { id: 'Q666' } );
		const entityRevision = new EntityRevision( entity, 0 );
		expect( entityRevision.entity ).toBe( entity );
	} );

	it( 'holds a revision id', () => {
		const revisionId = 4711;
		const entityRevision = new EntityRevision( newFingerprintable( {} ), revisionId );
		expect( entityRevision.revisionId ).toBe( revisionId );
	} );

} );
