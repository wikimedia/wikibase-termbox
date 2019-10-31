import buildAndAttemptHydration from '@/client/buildAndAttemptHydration';
import TermboxRequest from '@/common/TermboxRequest';

const mockBuildApp = jest.fn();
jest.mock( '@/common/buildApp', () => ( {
	__esModule: true,
	default: ( termboxRequest: TermboxRequest ) => mockBuildApp( termboxRequest ),
} ) );

describe( 'buildAndAttemptHydration', () => {

	it( 'builds and mounts the app once if the first attempt is successful', () => {
		const termboxRequest = new ( jest.fn() )();
		const selector = '.wikibase-entitytermsview';
		const mockApp = { $mount: jest.fn() };
		mockBuildApp.mockReturnValue( Promise.resolve( mockApp ) );

		return buildAndAttemptHydration( termboxRequest, selector ).then( () => {
			expect( mockBuildApp ).toHaveBeenCalledTimes( 1 );
			expect( mockBuildApp ).toHaveBeenCalledWith( termboxRequest );
			expect( mockApp.$mount ).toHaveBeenCalledWith( selector );
		} );
	} );

	it( 'removes the data-server-rendered attribute, and re-renders if the first mount failed', () => {
		const termboxRequest = new ( jest.fn() )();
		const selector = '.wikibase-entitytermsview';
		const mockApp = { $mount: jest.fn() };
		const mockTermboxElement = {
			removeAttribute: jest.fn(),
		};
		document.querySelector = jest.fn().mockReturnValue( mockTermboxElement );
		mockBuildApp
			.mockReturnValueOnce( Promise.resolve( {
				$mount: () => { throw new Error( 'sad markup mismatch' ); },
			} ) )
			.mockReturnValueOnce( Promise.resolve( mockApp ) );

		return buildAndAttemptHydration( termboxRequest, selector ).then( () => {
			expect( mockBuildApp ).toHaveBeenCalledTimes( 2 );
			expect( mockTermboxElement.removeAttribute ).toHaveBeenCalledWith( 'data-server-rendered' );
			expect( mockApp.$mount ).toHaveBeenCalledWith( selector );
		} );
	} );

} );
