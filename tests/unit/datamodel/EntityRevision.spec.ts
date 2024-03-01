import newFingerprintable from '../../newFingerprintable';
import EntityRevisionWithRedirect from '@/datamodel/EntityRevisionWithRedirect';

describe( 'EntityRevision', () => {

	it( 'holds an entity', () => {
		const entity = newFingerprintable( { id: 'Q666' } );
		const entityRevision = new EntityRevisionWithRedirect( entity, 0 );
		expect( entityRevision.entity ).toBe( entity );
	} );

	it( 'holds a revision id', () => {
		const revisionId = 4711;
		const entityRevision = new EntityRevisionWithRedirect( newFingerprintable( {} ), revisionId );
		expect( entityRevision.revisionId ).toBe( revisionId );
	} );

} );
