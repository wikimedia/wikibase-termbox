import { getAxios } from '@/client/axios/axiosFactory';
import MockAdapter from 'axios-mock-adapter';
import HttpStatus from 'http-status-codes';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';

const mockRequestBaseURL = 'foo';
const mockUsername = 'PacMan';
const axios = getAxios( mockRequestBaseURL, mockUsername );
const axiosMock = new MockAdapter( axios );

function addMockCSRFReply( axiosMock: MockAdapter ) {
	axiosMock.onGet( MEDIAWIKI_API_SCRIPT ).reply( HttpStatus.OK, {
		batchcomplete: '',
		query: {
			tokens: {
				csrftoken: 'fooToken',
			},
		},
	} );
}

describe( 'getAxios', () => {
	beforeEach( () => {
		axiosMock.reset();
	} );

	it( 'should return an Axios instance that transforms data to formData', () => {
		const postData = {
			someData: 'ThatShouldBeFormEncoded',
		};
		axiosMock.onPost( mockRequestBaseURL ).reply( HttpStatus.OK );
		addMockCSRFReply( axiosMock );
		return axios.post( mockRequestBaseURL, postData ).then( () => {
			expect( axiosMock.history.post[ 0 ].data ).toBeInstanceOf( FormData );
			expect( axiosMock.history.post[ 0 ].data.get( 'someData' ) ).toMatch( 'ThatShouldBeFormEncoded' );
		} );
	} );

	it( 'should return an Axios instance that makes a token GET request for all POSTs', () => {
		axiosMock.onPost( mockRequestBaseURL ).reply( HttpStatus.OK );
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

		return axios.post( mockRequestBaseURL, postData ).then( () => {
			expect( axiosMock.history.get[ 0 ].params ).toMatchObject( tokenRequestData.params );
			expect( axiosMock.history.post[ 0 ].data.get( 'token' ) ).toEqual( 'fooToken' );
		} );
	} );

	it( 'should return an Axios instance that has the correct baseURL', () => {
		const somePath = 'somePath';
		axiosMock.onGet( mockRequestBaseURL + '/' + somePath ).reply( HttpStatus.OK );
		return axios.get( somePath ).then( ( response ) => {
			expect( response.status ).toEqual( HttpStatus.OK );
		} );
	} );

	it( 'should assert user in POST requests if one is passed', () => {
		axiosMock.onPost( mockRequestBaseURL ).reply( HttpStatus.OK );
		axiosMock.onGet( MEDIAWIKI_API_SCRIPT ).reply( HttpStatus.OK, {
			batchcomplete: '',
			query: {
				tokens: {
					csrftoken: 'foo',
				},
			},
		} );
		return axios.post( mockRequestBaseURL, { action: 'fooAction' } ).then( () => {
			expect( axiosMock.history.post[ 0 ].data ).toBeInstanceOf( FormData );
			expect( axiosMock.history.post[ 0 ].data.get( 'assertuser' ) ).toEqual( mockUsername );
		} );
	} );
} );
