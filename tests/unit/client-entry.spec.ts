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

const buildApp = jest.fn();
jest.mock( '@/common/buildApp', () => ( {
	__esModule: true,
	default: ( ...args: any ) => buildApp( ...args ),
} ) );

function newMockConfigAndServices() {
	return {
		config: jest.fn(),
		services: { set: jest.fn(), get: jest.fn() },
	};
}

describe( 'client-entry', () => {
	it( 'initializes the TermboxRequest, config and services, then builds the app', () => {
		const expectedTermboxRequest = jest.fn();
		const { config, services } = newMockConfigAndServices();

		initMock.mockResolvedValueOnce( expectedTermboxRequest );
		initializeConfigAndDefaultServicesMock.mockReturnValueOnce( { config, services } );

		const expectedApp = jest.fn();
		buildApp.mockReturnValueOnce( expectedApp );

		return clientEntry( {} as any, true ).then( ( app ) => {
			expect( buildApp ).toHaveBeenCalledWith(
				expectedTermboxRequest,
				services,
				config,
			);
			expect( app ).toBe( expectedApp );
		} );
	} );

	it( 'adds the consumer-defined services to store services', ( done ) => {
		const expectedReadingEntityRepository = jest.fn() as any;
		const expectedWritingEntityRepository = jest.fn() as any;

		const servicesMock = { set: jest.fn() };
		initializeConfigAndDefaultServicesMock.mockReturnValueOnce( {
			config: {},
			services: servicesMock,
		} );

		initMock.mockResolvedValueOnce( jest.fn() );

		clientEntry(
			{
				readingEntityRepository: expectedReadingEntityRepository,
				writingEntityRepository: expectedWritingEntityRepository,
			},
			true,
		).then( () => {
			expect( servicesMock.set )
				.toHaveBeenCalledWith( 'entityRepository', expectedReadingEntityRepository );
			expect( servicesMock.set )
				.toHaveBeenCalledWith( 'writingEntityRepository', expectedWritingEntityRepository );
			done();
		} );
	} );

	it.each( [ true, false ] )(
		'sets the consumer-defined editability status to %s',
		( editability: boolean, done: any ) => {
			const servicesMock = { set: jest.fn() };
			initializeConfigAndDefaultServicesMock.mockReturnValueOnce( {
				config: {},
				services: servicesMock,
			} );

			initMock.mockResolvedValueOnce( jest.fn() );

			clientEntry(
				{
					readingEntityRepository: jest.fn() as any,
					writingEntityRepository: jest.fn() as any,
				},
				editability,
			).then( async () => {
				const [ name, editabilityResolver ] = servicesMock.set.mock.lastCall;
				expect( name ).toEqual( 'entityEditabilityResolver' );
				expect( await editabilityResolver.isEditable() ).toEqual( editability );

				done();
			} );
		},
	);
} );
