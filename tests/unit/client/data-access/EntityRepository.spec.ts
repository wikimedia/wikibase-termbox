import EntityRepository from '@/client/data-access/EntityRepository';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';

const REVISION_POSSIBLY_MATCHING_ENTITY = 1149; // this repo does not respect revisions

describe( 'EntityRepository', () => {

	it( 'getFingerPrintableEntity returns entity from entityLoaded hook ignoring revision', () => {
		const entityId = 'Q123';
		const revision = REVISION_POSSIBLY_MATCHING_ENTITY;
		const entityReturnedFromHook = {
			id: entityId,
			labels: { en: { language: 'en', value: 'potato' } },
			descriptions: { en: { language: 'en', value: 'root vegetable' } },
			aliases: { en: [ { language: 'en', value: 'patata' } ] },
		};
		const entityRepository = new EntityRepository(
			new ImmediatelyInvokingEntityLoadedHookHandler( entityReturnedFromHook ),
		);

		return entityRepository.getFingerprintableEntity( entityId, revision )
			.then( ( entity: FingerprintableEntity ) => {
				expect( entity ).toBeInstanceOf( FingerprintableEntity );

				expect( entity.id ).toEqual( entityReturnedFromHook.id );
				expect( entity.labels ).toEqual( entityReturnedFromHook.labels );
				expect( entity.descriptions ).toEqual( entityReturnedFromHook.descriptions );
				expect( entity.aliases ).toEqual( entityReturnedFromHook.aliases );
			} );
	} );

} );
