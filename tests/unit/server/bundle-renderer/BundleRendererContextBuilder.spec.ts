import BundleRendererContextBuilder from '@/server/bundle-renderer/BundleRendererContextBuilder';
import TermboxRequest from '@/common/TermboxRequest';
import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import BundleRendererContext from '@/server/bundle-renderer/BundleRendererContext';
import mwbot from 'mwbot';

function newBundleRendererContextBuilder( services: any ) {
	return new BundleRendererContextBuilder( services );
}

describe( 'BundleRendererContextBuilder', () => {
	describe( 'passRequest', () => {
		it( 'returns BundleRendererContext with correct values', () => {
			const services = new BundleRendererServices(
				new mwbot( {
					apiUrl: 'http://mywiki.com/api.php',
				} ),
			);
			const request = new TermboxRequest( 'Q71', 'de', '/edit/Q4711' );

			const builder = newBundleRendererContextBuilder( services );
			const bundleContext = builder.passRequest( request );

			expect( bundleContext ).toBeInstanceOf( BundleRendererContext );
			expect( bundleContext.services ).toEqual( services );
			expect( bundleContext.request ).toEqual( request );
		} );

	} );
} );
