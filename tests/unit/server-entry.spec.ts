import serverEntry from '@/server-entry';
import TermboxRequest from '@/common/TermboxRequest';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import BundleBoundaryPassingException, { ErrorReason } from '@/server/exceptions/BundleBoundaryPassingException';

const mockBuildApp = jest.fn();
jest.mock( '@/common/buildApp', () => ( {
	__esModule: true,
	default: ( termboxRequest: TermboxRequest ) => mockBuildApp( termboxRequest ),
} ) );

describe( 'server-entry', () => {
	it( 'converts bundle internal EntityNotFound exception to DTO', ( done ) => {
		const request = new TermboxRequest( 'en', 'Q4711' );

		mockBuildApp.mockReturnValue( Promise.reject( new EntityNotFound( 'bad entity id' ) ) );

		serverEntry( request ).catch( ( err ) => {
			expect( err ).toBeInstanceOf( BundleBoundaryPassingException );
			expect( err.reason ).toBe( ErrorReason.EntityNotFound );
			done();
		} );
	} );

	it( 'rethrows exceptions without custom propagation handling', ( done ) => {
		const request = new TermboxRequest( 'en', 'Q4711' );
		const someException = new Error( 'mine' );

		mockBuildApp.mockReturnValue( Promise.reject( someException ) );

		serverEntry( request ).catch( ( err ) => {
			expect( err ).toBe( someException );
			done();
		} );
	} );

} );
