import buildApp from '@/common/buildApp';
import App from '@/components/App.vue';

const mockGetChildComponents = jest.fn();
jest.mock( '@/common/getChildComponents', () => ( {
	__esModule: true,
	default: ( app: any ) => mockGetChildComponents( app ),
} ) );

jest.mock( '@/store' );

import store from '@/store';

describe( 'buildApp', () => {

	it( 'returns the app', () => {
		const request = { language: 'en', entityId: 'Q123' };
		mockGetChildComponents.mockReturnValue( [] );

		return buildApp( request ).then( ( app ) => {
			expect( app ).toBeInstanceOf( App );
		} );
	} );

	it( 'calls asyncData on all components, then returns the app', () => {
		const request = { language: 'en', entityId: 'Q123' };

		const mockAsyncData1 = jest.fn();
		const mockAsyncData2 = jest.fn();
		const mockComponent1 = { asyncData: mockAsyncData1 };
		const mockComponent2 = { asyncData: mockAsyncData2 };

		mockAsyncData1.mockReturnValue( Promise.resolve() );
		mockAsyncData1.mockReturnValue( Promise.resolve() );

		mockGetChildComponents.mockReturnValue( [ mockComponent1, mockComponent2, {} ] );

		return buildApp( request ).then( ( app ) => {
			expect( mockAsyncData1 ).toBeCalledWith( store, request );
			expect( mockAsyncData2 ).toBeCalledWith( store, request );

			expect( app ).toBeInstanceOf( App );
		} );
	} );

} );
