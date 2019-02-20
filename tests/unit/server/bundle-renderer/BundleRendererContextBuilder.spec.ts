import BundleRendererContextBuilder from '@/server/bundle-renderer/BundleRendererContextBuilder';
import TermboxRequest from '@/common/TermboxRequest';
import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import BundleRendererContext from '@/server/bundle-renderer/BundleRendererContext';
import axios from 'axios';

function newBundleRendererContextBuilder( services: any ) {
	return new BundleRendererContextBuilder( services );
}

describe( 'BundleRendererContextBuilder', () => {
	describe( 'passRequest', () => {
		it( 'returns BundleRendererContext with correct values', () => {
			const services = new BundleRendererServices(
				axios,
				{ log: () => {} },
			);
			const request = new TermboxRequest( 'Q71', 'de', 31510, '/edit/Q4711', [ 'de', 'en', 'fr', 'it', 'pl' ] );

			const builder = newBundleRendererContextBuilder( services );
			const bundleContext = builder.passRequest( request );

			expect( bundleContext ).toBeInstanceOf( BundleRendererContext );
			expect( bundleContext.services ).toEqual( services );
			expect( bundleContext.request ).toEqual( request );
		} );

	} );
} );
