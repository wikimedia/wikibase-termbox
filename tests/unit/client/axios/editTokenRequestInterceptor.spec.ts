import MockAdapter from 'axios-mock-adapter';
import axios, { AxiosRequestConfig } from 'axios';
import editTokenRequestInterceptor from '@/client/axios/editTokenRequestInterceptor';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import { StatusCodes } from 'http-status-codes';

const axiosMock = new MockAdapter( axios );

function newEditTokenRequestInterceptor() {
	return editTokenRequestInterceptor( axios );
}

function clone( getRequest: AxiosRequestConfig ) {
	return JSON.parse( JSON.stringify( getRequest ) );
}

function newFakePostRequest(): AxiosRequestConfig {
	return {
		method: 'post',
		url: '/mediawiki/api.php',
		data: {
			action: 'some',
		},
	};
}

const tokenRequestData = {
	params: {
		action: 'query',
		meta: 'tokens',
		type: 'csrf',
	},
};

function mockSuccessfulTokenRequest( token: string ) {
	axiosMock.onGet( MEDIAWIKI_API_SCRIPT, tokenRequestData )
		.reply( StatusCodes.OK, {
			batchcomplete: '',
			query: {
				tokens: {
					csrftoken: token,
				},
			},
		} );
}

describe( 'editTokenRequestInterceptor', () => {
	beforeEach( () => {
		axiosMock.reset();
	} );

	it( 'does nothing for get requests', () => {
		const interceptor = newEditTokenRequestInterceptor();
		const getRequest: AxiosRequestConfig = {
			method: 'get',
			url: '/mediawiki/api.php',
			params: {
				action: 'some',
			},
		};
		const originalRequest = clone( getRequest );

		return interceptor( getRequest ).then( ( request ) => {
			expect( request ).toEqual( originalRequest );
		} );
	} );

	it( 'requests and appends a CSRF token for post requests', () => {
		const token = 'awesome-token';
		mockSuccessfulTokenRequest( token );

		const actionRequiringToken = newFakePostRequest();
		const expectedRequest = clone( actionRequiringToken );
		expectedRequest.data.token = token;

		return newEditTokenRequestInterceptor()( actionRequiringToken ).then( ( request ) => {
			expect( axiosMock.history.get[ 0 ].params ).toEqual( tokenRequestData.params );
			expect( request ).toEqual( expectedRequest );
		} );
	} );

	it( 'integrates with axios', () => {
		const token = 'awesome-token';
		mockSuccessfulTokenRequest( token );

		const postData = {
			action: 'some',
		};
		const expectedPostData = {
			action: 'some',
			token,
		};

		axios.interceptors.request.use( newEditTokenRequestInterceptor() );

		axiosMock.onPost( MEDIAWIKI_API_SCRIPT ).reply( StatusCodes.OK );
		return axios.post( MEDIAWIKI_API_SCRIPT, postData ).then( () => {
			expect( axiosMock.history.get[ 0 ].params ).toEqual( tokenRequestData.params );
			expect( axiosMock.history.post[ 0 ].data ).toEqual( JSON.stringify( expectedPostData ) );
		} );
	} );

	it( 'rejects with TechnicalProblem in case the API did not respond with a token', () => {
		axiosMock.onGet( MEDIAWIKI_API_SCRIPT, tokenRequestData )
			.reply( StatusCodes.OK, { sadness: true } );
		const actionRequiringToken = newFakePostRequest();

		return newEditTokenRequestInterceptor()( actionRequiringToken ).catch( ( error ) => {
			expect( error ).toBeInstanceOf( TechnicalProblem );
		} );
	} );

	it( 'rejects with TechnicalProblem in case the API request fails', () => {
		axiosMock.onGet( MEDIAWIKI_API_SCRIPT, tokenRequestData ).networkError();
		const actionRequiringToken = newFakePostRequest();

		return newEditTokenRequestInterceptor()( actionRequiringToken ).catch( ( error ) => {
			expect( error ).toBeInstanceOf( TechnicalProblem );
		} );
	} );

} );
