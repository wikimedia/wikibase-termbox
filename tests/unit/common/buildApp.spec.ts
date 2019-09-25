import buildApp from '@/common/buildApp';
import App from '@/components/App.vue';

const mockGetChildComponents = jest.fn();
jest.mock( '@/common/getChildComponents', () => ( {
	__esModule: true,
	default: ( app: any ) => mockGetChildComponents( app ),
} ) );

const mockCreateStore = jest.fn();
jest.mock( '@/store', () => ( {
	__esModule: true,
	createStore: ( services: any ) => mockCreateStore( services ),
} ) );

describe( 'buildApp', () => {

	it( 'returns the app', () => {
		const request = {
			language: 'en',
			entityId: 'Q123',
			revision: 31510,
			links: { editLinkUrl: '/edit/Q123', loginLinkUrl: '/login', signUpLinkUrl: '/signup' },
			preferredLanguages: [ 'de', 'en', 'fr', 'it', 'pl' ],
			userName: null,
		};
		const services = new ( jest.fn() )();

		mockGetChildComponents.mockReturnValue( [] );

		return buildApp( request, services ).then( ( app ) => {
			expect( app ).toBeInstanceOf( App );
		} );
	} );

	it( 'calls asyncData on all components, then returns the app', () => {
		const request = {
			language: 'en',
			entityId: 'Q123',
			revision: 31510,
			links: { editLinkUrl: '/edit/Q123', loginLinkUrl: '/login', signUpLinkUrl: '/signup' },
			preferredLanguages: [ 'en', 'de', 'fr', 'it', 'pl' ],
			userName: null,
		};
		const services = new ( jest.fn() )();

		const mockAsyncData1 = jest.fn();
		const mockAsyncData2 = jest.fn();
		const mockComponent1 = { asyncData: mockAsyncData1 };
		const mockComponent2 = { asyncData: mockAsyncData2 };

		const store = {};
		mockCreateStore.mockReturnValue( store );

		mockAsyncData1.mockReturnValue( Promise.resolve() );
		mockAsyncData1.mockReturnValue( Promise.resolve() );

		mockGetChildComponents.mockReturnValue( [ mockComponent1, mockComponent2, {} ] );

		return buildApp( request, services ).then( ( app ) => {
			expect( mockAsyncData1 ).toBeCalledWith( store, request );
			expect( mockAsyncData2 ).toBeCalledWith( store, request );

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
