import { getAxios } from '@/server/axios/axiosFactory';
import MockAdapter from 'axios-mock-adapter';
import HttpStatus from 'http-status-codes';
import axiosLib from 'axios';

describe( 'getAxios', () => {
	it( 'should return an Axios instance that makes requests with the correct baseURL', () => {
		const mockRepo = 'http://test.wiki.example.com/w';
		const mockTimeout = 123;
		const mockUserAgentString = 'Secret Agent 1.0';
		const axios = getAxios( mockRepo, mockTimeout, mockUserAgentString );
		const axiosMock = new MockAdapter( axios );
		const somePath = 'somePath';

		axiosMock.onGet( mockRepo + '/' + somePath ).reply( HttpStatus.OK );

		return axios.get( somePath ).then( ( response ) => {
			expect( response.status ).toEqual( HttpStatus.OK );
		} );
	} );

	it( 'should return an Axios instance that makes requests with the right UserAgent', () => {
		const mockRepo = 'http://test.wiki.example.com/w';
		const mockTimeout = 123;
		const mockUserAgentString = 'Secret Agent 1.0';
		const axios = getAxios( mockRepo, mockTimeout, mockUserAgentString );
		const axiosMock = new MockAdapter( axios );
		const somePath = 'somePath';
		axiosMock.onGet( mockRepo + '/' + somePath ).reply( HttpStatus.OK );

		return axios.get( somePath ).then( () => {
			expect( axiosMock.history.get[ 0 ].headers[ 'User-Agent' ] ).toEqual( mockUserAgentString );
		} );
	} );

	it( 'should return an Axios instance that has a timeout set', () => {
		const mockRepo = 'http://test.wiki.example.com/w';
		const mockTimeout = 123;
		const mockUserAgentString = 'Secret Agent 1.0';

		const createMock = jest.spyOn( axiosLib, 'create' );

		getAxios( mockRepo, mockTimeout, mockUserAgentString );

		expect( createMock.mock.calls[ 0 ][ 0 ]!.timeout ).toEqual( 123 );
	} );
} );
