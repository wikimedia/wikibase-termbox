import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import mwbot from 'mwbot';

describe( 'BundleRendererServices', () => {
	it( 'can be constructed and assigns properties', () => {
		const bot = new mwbot( {} );
		const logger = { log: () => {} };

		const services = new BundleRendererServices( bot, logger );

		expect( services ).toBeInstanceOf( BundleRendererServices );
		expect( services.mediawikiBot ).toBe( bot );
		expect( services.logger ).toBe( logger );
	} );

} );
