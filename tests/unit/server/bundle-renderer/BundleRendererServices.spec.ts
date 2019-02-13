import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import axios from 'axios';

describe( 'BundleRendererServices', () => {
	it( 'can be constructed and assigns properties', () => {
		const logger = { log: () => {} };

		const services = new BundleRendererServices( axios, logger );

		expect( services ).toBeInstanceOf( BundleRendererServices );
		expect( services.axios ).toBe( axios );
		expect( services.logger ).toBe( logger );
	} );

} );
