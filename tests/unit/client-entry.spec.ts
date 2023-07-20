import clientEntry from '@/client-entry';

const initMock = jest.fn();
jest.mock( '@/client/init', () => ( {
	__esModule: true,
	default: () => initMock(),
} ) );

const initializeConfigAndDefaultServicesMock = jest.fn();
jest.mock( '@/client/initializeConfigAndDefaultServices', () => ( {
	__esModule: true,
	default: () => initializeConfigAndDefaultServicesMock(),
} ) );

const buildAndAttemptHydrationMock = jest.fn();
jest.mock( '@/client/buildAndAttemptHydration', () => ( {
	__esModule: true,
	default: ( ...args: any ) => buildAndAttemptHydrationMock( ...args ),
} ) );

describe( 'client-entry', () => {
	it( 'initializes the TermboxRequest, config and services, then builds the app', ( done ) => {
		const expectedTermboxRequest = jest.fn();
		const expectedConfig = jest.fn();
		const expectedServices = jest.fn();

		initMock.mockResolvedValueOnce( expectedTermboxRequest );
		initializeConfigAndDefaultServicesMock.mockReturnValueOnce( {
			config: expectedConfig,
			services: expectedServices,
		} );

		clientEntry().then( () => {
			expect( buildAndAttemptHydrationMock ).toHaveBeenCalledWith(
				expectedTermboxRequest,
				expectedServices,
				expectedConfig,
			);
			done();
		} );
	} );
} );
