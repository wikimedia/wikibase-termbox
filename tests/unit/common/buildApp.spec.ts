import buildApp from '@/common/buildApp';

const mockInitStore = jest.fn();
jest.mock( '@/common/initStore', () => ( {
	__esModule: true,
	default: ( store: any, request: any ) => mockInitStore( store, request ),
} ) );

const mockCreateStore = jest.fn();
jest.mock( '@/store', () => ( {
	__esModule: true,
	createStore: ( services: any ) => mockCreateStore( services ),
} ) );

describe( 'buildApp', () => {

	it( 'calls initStore, then returns the app', () => {
		const request = {
			language: 'en',
			entityId: 'Q123',
			revision: 31510,
			links: { editLinkUrl: '/edit/Q123', loginLinkUrl: '/login', signUpLinkUrl: '/signup' },
			preferredLanguages: [ 'de', 'en', 'fr', 'it', 'pl' ],
			userName: null,
		};
		const services = new ( jest.fn() )();
		const config = new ( jest.fn() )();

		const store = { install: jest.fn() };
		mockCreateStore.mockReturnValue( store );

		mockInitStore.mockResolvedValue( [] );

		return buildApp( request, services, config ).then( ( app ) => {
			expect( mockInitStore ).toBeCalledWith( store, request );

			expect( typeof ( app.$mount || app.mount ) ).toBe( 'function' );
		} );
	} );

	it( 'creates the store with the given services', () => {
		const request = {
			language: 'en',
			entityId: 'Q123',
			revision: 31510,
			links: { editLinkUrl: '/edit/Q123', loginLinkUrl: '/login', signUpLinkUrl: '/signup' },
			preferredLanguages: [ 'en', 'de', 'fr', 'it', 'pl' ],
			userName: null,
		};
		const services = new ( jest.fn() )();
		const config = new ( jest.fn() )();

		const store = { install: jest.fn() };
		mockCreateStore.mockReturnValue( store );

		return buildApp( request, services, config ).then( ( app ) => {
			expect( mockCreateStore ).toHaveBeenCalledWith( services );

			expect( typeof ( app.$mount || app.mount ) ).toBe( 'function' );
		} );
	} );

} );
