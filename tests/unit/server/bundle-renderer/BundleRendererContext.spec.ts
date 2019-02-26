import TermboxRequest from '@/common/TermboxRequest';
import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import BundleRendererContext from '@/server/bundle-renderer/BundleRendererContext';
import axios from 'axios';

describe( 'BundleRendererContext', () => {
	it( 'can be constructed and assigns properties', () => {
		const services = new BundleRendererServices(
			axios,
			{ log: () => {} },
		);
		const request = new TermboxRequest( 'Q71', 'de', '/edit/Q4711', [ 'de', 'en', 'fr', 'it', 'pl' ] );

		const context = new BundleRendererContext(
			services,
			request,
		);

		expect( context ).toBeInstanceOf( BundleRendererContext );
		expect( context.services ).toEqual( services );
		expect( context.request ).toEqual( request );
	} );

} );
