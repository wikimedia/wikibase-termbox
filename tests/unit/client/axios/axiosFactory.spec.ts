import axiosFactory from '@/client/axios/axiosFactory';
import MockAdapter from 'axios-mock-adapter';
import { StatusCodes } from 'http-status-codes';
import { GLOBAL_REQUEST_PARAMS, MEDIAWIKI_API_SCRIPT } from '@/common/constants';

const mockRequestBaseURL = 'foo';
const mockUsername = 'PacMan';
const axios = axiosFactory( mockRequestBaseURL, mockUsername );
const axiosMock = new MockAdapter( axios );

function addMockCSRFReply( axiosMock: MockAdapter ) {
	axiosMock.onGet( MEDIAWIKI_API_SCRIPT ).reply( StatusCodes.OK, {
		batchcomplete: '',
		query: {
			tokens: {
				csrftoken: 'fooToken',
			},
		},
	} );
}

describe( 'axiosFactory', () => {
	beforeEach( () => {
		axiosMock.reset();
	} );

	it( 'should return an Axios instance that transforms data to formData', () => {
		const postData = {
			someData: 'ThatShouldBeFormEncoded',
		};
		axiosMock.onPost( MEDIAWIKI_API_SCRIPT ).reply( StatusCodes.OK );
		addMockCSRFReply( axiosMock );
		return axios.post( MEDIAWIKI_API_SCRIPT, postData ).then( () => {
			expect( axiosMock.history.post[ 0 ].data ).toBeInstanceOf( FormData );
			expect( axiosMock.history.post[ 0 ].data.get( 'someData' ) ).toMatch( 'ThatShouldBeFormEncoded' );
		} );
	} );

	it( 'should return an Axios instance that makes a token GET request for all POSTs', () => {
		axiosMock.onPost( MEDIAWIKI_API_SCRIPT ).reply( StatusCodes.OK );
		addMockCSRFReply( axiosMock );
		const postData = {
			action: 'some',
		};

		const tokenRequestData = {
			params: {
				action: 'query',
				meta: 'tokens',
				type: 'csrf',
			},
		};

		return axios.post( MEDIAWIKI_API_SCRIPT, postData ).then( () => {
			expect( axiosMock.history.get[ 0 ].params ).toMatchObject( tokenRequestData.params );
			expect( axiosMock.history.post[ 0 ].data.get( 'token' ) ).toEqual( 'fooToken' );
		} );
	} );

	it( 'should return an Axios instance that has the correct baseURL', () => {
		const somePath = 'somePath';
		axiosMock.onGet( `${mockRequestBaseURL}/${somePath}` ).reply( StatusCodes.OK );
		return axios.get( somePath ).then( ( response ) => {
			expect( response.status ).toEqual( StatusCodes.OK );
		} );
	} );

	it( 'should assert user in POST requests if one is passed', () => {
		axiosMock.onPost( MEDIAWIKI_API_SCRIPT ).reply( StatusCodes.OK );
		axiosMock.onGet( MEDIAWIKI_API_SCRIPT ).reply( StatusCodes.OK, {
			batchcomplete: '',
			query: {
				tokens: {
					csrftoken: 'foo',
				},
			},
		} );
		return axios.post( MEDIAWIKI_API_SCRIPT, { action: 'fooAction' } ).then( () => {
			expect( axiosMock.history.post[ 0 ].data ).toBeInstanceOf( FormData );
			expect( axiosMock.history.post[ 0 ].data.get( 'assertuser' ) ).toEqual( mockUsername );
		} );
	} );

	it( 'contains the global default params in every request', async () => {
		axiosMock.onGet( '/' ).reply( StatusCodes.OK );

		await axios.get( '/' );

		expect( axiosMock.history.get[ 0 ].params ).toMatchObject( GLOBAL_REQUEST_PARAMS );
	} );
} );
