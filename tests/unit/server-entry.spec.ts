import serverEntry from '@/server-entry';
import TermboxRequest from '@/common/TermboxRequest';
import TermboxServices from '@/common/TermboxServices';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import BundleBoundaryPassingException, { ErrorReason } from '@/server/exceptions/BundleBoundaryPassingException';
import BundleRendererContext from '@/server/bundle-renderer/BundleRendererContext';
import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';

const mockBuildApp = jest.fn();
jest.mock( '@/common/buildApp', () => ( {
	__esModule: true,
	default: (
		termboxRequest: TermboxRequest,
		services: TermboxServices,
	) => mockBuildApp( termboxRequest, services ),
} ) );

const mockServices = {
	get: jest.fn(),
	set: jest.fn(),
};
jest.mock( '@/common/TermboxServices', () => {
	return jest.fn().mockImplementation( () => {
		return mockServices;
	} );
} );

const axiosFactory = jest.fn();
function getMockBundleRendererServices() {
	const services = {} as BundleRendererServices;
	Object.defineProperty( services, 'axios', {
		get: axiosFactory,
	} );
	return services;
}

function newFineBundleRendererContext() {
	return new BundleRendererContext(
		getMockBundleRendererServices(),
		new TermboxRequest(
			'Q71',
			'de',
			31510,
			{
				editLinkUrl: '/edit/Q4711',
				loginLinkUrl: '',
				signUpLinkUrl: '',
			},
			[ 'de', 'en', 'fr', 'it', 'pl' ],
		),
	);
}

describe( 'server-entry', () => {
	it( 'passes TermboxRequest to buildApp and resolves to HTML', ( done ) => {
		const result = 'hello';
		const ssrContext = newFineBundleRendererContext();

		mockBuildApp.mockResolvedValue( 'hello' );

		serverEntry( ssrContext ).then( ( html ) => {
			expect( mockBuildApp ).toBeCalledWith(
				ssrContext.request,
				mockServices,
			);
			expect( html ).toBe( result );
			done();
		} );
	} );

	it( 'setup the service container', ( done ) => {
		const ssrContext = newFineBundleRendererContext();
		const services = [
			'entityEditabilityResolver',
			'entityRepository',
			'languageRepository',
			'languageTranslationRepository',
			'messagesRepository',
			'userPreferenceRepository',
			'writingEntityRepository',
		];

		mockBuildApp.mockResolvedValue( 'hello' );
		serverEntry( ssrContext ).then( () => {
			const calledServices = [];
			expect( mockServices.set ).toHaveBeenCalledTimes( 7 );

			for ( const service of mockServices.set.mock.calls ) {
				calledServices.push( service[ 0 ] );
			}
			calledServices.sort();

			expect( calledServices ).toStrictEqual( services );
			done();
		} );
	} );

	it( 'uses axios from services', () => {
		const ssrContext = newFineBundleRendererContext();

		return serverEntry( ssrContext ).then( () => {
			expect( axiosFactory ).toBeCalledTimes( 1 );
		} );
	} );

	it( 'converts bundle internal EntityNotFound exception to DTO', ( done ) => {
		const ssrContext = newFineBundleRendererContext();
		const errorMessage = 'bad entity id';
		const entityNotFoundError = new EntityNotFound( errorMessage, { entity: 'Q123', revision: 234 } );
		mockBuildApp.mockReturnValue( Promise.reject( entityNotFoundError ) );

		serverEntry( ssrContext ).catch( ( err ) => {
			expect( err ).toBeInstanceOf( BundleBoundaryPassingException );
			expect( err.reason ).toBe( ErrorReason.EntityNotFound );
			expect( err.getContext() ).toEqual( entityNotFoundError.getContext() );
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
