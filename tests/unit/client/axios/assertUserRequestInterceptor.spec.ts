import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import assertUserRequestInterceptor from '@/client/axios/assertUserRequestInterceptor';

const scriptPath = 'fake.php';

describe( 'assertUserRequestInterceptor', () => {

	it( 'adds an assertuser if one is provided', () => {
		const axiosInstance = axios.create();
		const axiosMock = new MockAdapter( axiosInstance );
		const username = 'Jeff';
		axiosMock.onPost( scriptPath )
			.reply( StatusCodes.OK );
		axiosInstance.interceptors.request.use( assertUserRequestInterceptor( username ) );
		return axiosInstance.post( scriptPath, { action: 'fooAction' } ).then( () => {
			expect( JSON.parse( axiosMock.history.post[ 0 ].data ).assertuser ).toEqual( username );
		} );
	} );

	it( 'does not add an assertuser parameter if null is provided', () => {
		const axiosInstance = axios.create();
		const axiosMock = new MockAdapter( axiosInstance );
		axiosMock.onPost( scriptPath )
			.reply( StatusCodes.OK );
		axiosInstance.interceptors.request.use( assertUserRequestInterceptor( null ) );
		return axiosInstance.post( scriptPath, { action: 'fooAction' } ).then( () => {
			expect( JSON.parse( axiosMock.history.post[ 0 ].data ).assertuser ).toBeUndefined();
		} );
	} );
} );
