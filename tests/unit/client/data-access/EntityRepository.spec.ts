import EntityRepository from '@/client/data-access/EntityRepository';
import MwWindow from '@/client/MwWindow';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';

describe( 'EntityRepository', () => {

	it( 'getFingerPrintableEntity returns entity from entityLoaded hook', () => {
		const entityRepository = new EntityRepository();
		const entityReturnedFromHook = {
			id: 'Q123',
			labels: { en: { language: 'en', value: 'potato' } },
			descriptions: { en: { language: 'en', value: 'root vegetable' } },
			aliases: { en: [ { language: 'en', value: 'patata' } ] },
		};
		const configGet = jest.fn();
		( window as MwWindow ).mw = {
			hook() {
				return new ImmediatelyInvokingEntityLoadedHookHandler( entityReturnedFromHook );
			},
			config: {
				get: configGet,
			},
		};

		return entityRepository.getFingerprintableEntity( 'Q123' ).then( ( entity: FingerprintableEntity ) => {
			expect( entity ).toBeInstanceOf( FingerprintableEntity );

			expect( entity.id ).toBe( entityReturnedFromHook.id );
			expect( entity.labels ).toBe( entityReturnedFromHook.labels );
			expect( entity.descriptions ).toBe( entityReturnedFromHook.descriptions );
			expect( entity.aliases ).toBe( entityReturnedFromHook.aliases );

			expect( configGet ).not.toBeCalled();
		} );
	} );

} );
