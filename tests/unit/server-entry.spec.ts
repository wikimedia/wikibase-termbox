import serverEntry from '@/server-entry';
import TermboxRequest from '@/common/TermboxRequest';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import BundleBoundaryPassingException, { ErrorReason } from '@/server/exceptions/BundleBoundaryPassingException';
import BundleRendererContext from '@/server/bundle-renderer/BundleRendererContext';
import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';

const mockBuildApp = jest.fn();
jest.mock( '@/common/buildApp', () => ( {
	__esModule: true,
	default: ( termboxRequest: TermboxRequest ) => mockBuildApp( termboxRequest ),
} ) );

const getMediawikiBot = jest.fn();
function getMockBundleRendererServices() {
	const services = {} as BundleRendererServices;
	Object.defineProperty( services, 'mediawikiBot', {
		get: getMediawikiBot,
	} );
	return services;
}

describe( 'server-entry', () => {
	it( 'passes TermboxRequest to buildApp and resolves to HTML', ( done ) => {
		const result = 'hello';

		const ssrContext = new BundleRendererContext(
			getMockBundleRendererServices(),
			new TermboxRequest( 'en', 'Q4711', '/edit/Q4711' ),
		);

		mockBuildApp.mockResolvedValue( 'hello' );

		serverEntry( ssrContext ).then( ( html ) => {
			expect( mockBuildApp ).toBeCalledWith( ssrContext.request );
			expect( html ).toBe( result );
			done();
		} );
	} );

	it( 'uses mwbot from services', ( done ) => {
		const ssrContext = new BundleRendererContext(
			getMockBundleRendererServices(),
			new TermboxRequest( 'en', 'Q4711', '/edit/Q4711' ),
		);

		serverEntry( ssrContext ).then( () => {
			expect( getMediawikiBot ).toBeCalledTimes( 2 );
			done();
		} );
	} );

	it( 'converts bundle internal EntityNotFound exception to DTO', ( done ) => {
		const ssrContext = new BundleRendererContext(
			getMockBundleRendererServices(),
			new TermboxRequest( 'en', 'Q4711', '/edit/Q4711' ),
		);

		mockBuildApp.mockReturnValue( Promise.reject( new EntityNotFound( 'bad entity id' ) ) );

		serverEntry( ssrContext ).catch( ( err ) => {
			expect( err ).toBeInstanceOf( BundleBoundaryPassingException );
			expect( err.reason ).toBe( ErrorReason.EntityNotFound );
			done();
		} );
	} );

	it( 'rethrows exceptions without custom propagation handling', ( done ) => {
		const ssrContext = new BundleRendererContext(
			getMockBundleRendererServices(),
			new TermboxRequest( 'en', 'Q4711', '/edit/Q4711' ),
		);
		const someException = new Error( 'mine' );

		mockBuildApp.mockReturnValue( Promise.reject( someException ) );

		serverEntry( ssrContext ).catch( ( err ) => {
			expect( err ).toBe( someException );
			done();
		} );
	} );

} );
