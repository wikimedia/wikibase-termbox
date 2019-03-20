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
const getAxios = jest.fn();
function getMockBundleRendererServices() {
	const services = {} as BundleRendererServices;
	Object.defineProperty( services, 'axios', {
		get: getAxios,
	} );
	return services;
}

function newFineBundleRendererContext() {
	return new BundleRendererContext(
		getMockBundleRendererServices(),
		new TermboxRequest( 'en', 'Q4711', 31510, '/edit/Q4711', [ 'de', 'en', 'fr', 'it', 'pl' ] ),
	);
}

describe( 'server-entry', () => {
	it( 'passes TermboxRequest to buildApp and resolves to HTML', ( done ) => {
		const result = 'hello';
		const ssrContext = newFineBundleRendererContext();

		mockBuildApp.mockResolvedValue( 'hello' );

		serverEntry( ssrContext ).then( ( html ) => {
			expect( mockBuildApp ).toBeCalledWith( ssrContext.request );
			expect( html ).toBe( result );
			done();
		} );
	} );

	it( 'uses axios from services', ( done ) => {
		const ssrContext = newFineBundleRendererContext();

		serverEntry( ssrContext ).then( () => {
			expect( getAxios ).toBeCalledTimes( 2 );
			done();
		} );
	} );

	it( 'converts bundle internal EntityNotFound exception to DTO', ( done ) => {
		const ssrContext = newFineBundleRendererContext();

		mockBuildApp.mockReturnValue( Promise.reject( new EntityNotFound( 'bad entity id' ) ) );

		serverEntry( ssrContext ).catch( ( err ) => {
			expect( err ).toBeInstanceOf( BundleBoundaryPassingException );
			expect( err.reason ).toBe( ErrorReason.EntityNotFound );
			done();
		} );
	} );

	it( 'rethrows exceptions without custom propagation handling', ( done ) => {
		const ssrContext = newFineBundleRendererContext();
		const someException = new Error( 'mine' );

		mockBuildApp.mockReturnValue( Promise.reject( someException ) );

		serverEntry( ssrContext ).catch( ( err ) => {
			expect( err ).toBe( someException );
			done();
		} );
	} );

} );
