import EntityRepository from '@/client/data-access/EntityRepository';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import EntityInitializer from '@/common/EntityInitializer';
import EntityInitializerInterface from '@/common/EntityInitializerInterface';
import HookHandler from '@/client/mediawiki/HookHandler';

const REVISION_POSSIBLY_MATCHING_ENTITY = 1149; // this repo does not respect revisions

function newEntityRepository( hookHandler: HookHandler, initializer?: EntityInitializerInterface ) {
	return new EntityRepository(
		hookHandler,
		initializer || new EntityInitializer(),
	);
}

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
		const entityRepository = newEntityRepository(
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

	it( 'runs the entity returned from hook through EntityInitializer', () => {
		const entityId = 'Q3';
		const revision = REVISION_POSSIBLY_MATCHING_ENTITY;
		const entityReturnedFromHook = {};
		const entityFromInitializer = {};
		const initializer = {
			newFromSerialization: jest.fn().mockReturnValue( entityFromInitializer ),
		};
		const entityRepository = newEntityRepository(
			new ImmediatelyInvokingEntityLoadedHookHandler( entityReturnedFromHook ),
			initializer,
		);

		return entityRepository.getFingerprintableEntity( entityId, revision ).then( ( entity ) => {
			expect( initializer.newFromSerialization ).toHaveBeenCalledWith( entityReturnedFromHook );
			expect( entity ).toBe( entityFromInitializer );
		} );
	} );

	it( 'rejects stating the reason in case of entity initialization problem', () => {
		const entityId = 'Q3';
		const revision = REVISION_POSSIBLY_MATCHING_ENTITY;
		const entityReturnedFromHook = {
			id: entityId,
		};
		const initializer = {
			newFromSerialization: () => {
				throw new Error( 'initializer sad' );
			},
		};
		const entityRepository = newEntityRepository(
			new ImmediatelyInvokingEntityLoadedHookHandler( entityReturnedFromHook ),
			initializer,
		);

		return entityRepository.getFingerprintableEntity( entityId, revision ).catch( ( reason: Error ) => {
			expect( reason ).toBeInstanceOf( Error );
			expect( reason.message ).toEqual( 'initializer sad' );
		} );
	} );

} );
