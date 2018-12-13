import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import mwbot from 'mwbot';

describe( 'BundleRendererServices', () => {
	it( 'can be constructed and assigns properties', () => {
		const bot = new mwbot( {} );

		const services = new BundleRendererServices( bot );

		expect( services ).toBeInstanceOf( BundleRendererServices );
		expect( services.mediawikiBot ).toEqual( bot );
	} );

} );
