import buildApp from '@/common/buildApp';
import App from '@/components/App.vue';

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

		const store = {};
		mockCreateStore.mockReturnValue( store );

		mockInitStore.mockResolvedValue( [] );

		return buildApp( request, services ).then( ( app ) => {
			expect( mockInitStore ).toBeCalledWith( store, request );

			expect( app ).toBeInstanceOf( App );
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

		const store = {};
		mockCreateStore.mockReturnValue( store );

		return buildApp( request, services ).then( ( app ) => {
			expect( mockCreateStore ).toHaveBeenCalledWith( services );

			expect( app ).toBeInstanceOf( App );
		} );
	} );
} );
