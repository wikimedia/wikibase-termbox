import TermboxRequest from '@/common/TermboxRequest';
import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import BundleRendererContext from '@/server/bundle-renderer/BundleRendererContext';
import mwbot from 'mwbot';

describe( 'BundleRendererContext', () => {
	it( 'can be constructed and assigns properties', () => {
		const services = new BundleRendererServices( new mwbot( {} ) );
		const request = new TermboxRequest( 'Q71', 'de', '/edit/Q4711' );

		const context = new BundleRendererContext(
			services,
			request,
		);

		expect( context ).toBeInstanceOf( BundleRendererContext );
		expect( context.services ).toEqual( services );
		expect( context.request ).toEqual( request );
	} );

} );
