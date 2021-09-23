import axiosFactory from '@/server/axios/axiosFactory';
import MockAdapter from 'axios-mock-adapter';
import { StatusCodes } from 'http-status-codes';
import axiosLib from 'axios';
import { GLOBAL_REQUEST_PARAMS } from '@/common/constants';

describe( 'axiosFactory', () => {
	it( 'should return an Axios instance that makes requests with the correct baseURL', () => {
		const mockWikiHostSubPath = 'w';
		const mockRepo = `http://test.wiki.example.com/${mockWikiHostSubPath}`;
		const mockTimeout = 123;
		const mockUserAgentString = 'Secret Agent 1.0';
		const mockRepoHostAlias = 'reverse.proxy.test';
		const axios = axiosFactory( mockRepo, mockRepoHostAlias, mockTimeout, mockUserAgentString );
		const axiosMock = new MockAdapter( axios );

		const somePath = 'somePath';
		axiosMock.onGet( `http://${mockRepoHostAlias}/${mockWikiHostSubPath}/${somePath}` )
			.reply( StatusCodes.OK );

		return axios.get( somePath ).then( ( response ) => {
			expect( response.status ).toEqual( StatusCodes.OK );
		} );
	} );

	it( 'should return an Axios instance that makes requests with the right UserAgent', () => {
		const mockWikiHostSubPath = 'w';
		const mockRepo = `http://test.wiki.example.com/${mockWikiHostSubPath}`;
		const mockTimeout = 123;
		const mockUserAgentString = 'Secret Agent 1.0';
		const mockRepoHostAlias = 'reverse.proxy.test';
		const axios = axiosFactory( mockRepo, mockRepoHostAlias, mockTimeout, mockUserAgentString );
		const axiosMock = new MockAdapter( axios );
		const somePath = 'somePath';
		axiosMock.onGet( `http://${mockRepoHostAlias}/${mockWikiHostSubPath}/${somePath}` )
			.reply( StatusCodes.OK );

		return axios.get( somePath ).then( () => {
			expect( axiosMock.history.get[ 0 ].headers[ 'User-Agent' ] ).toEqual( mockUserAgentString );
		} );
	} );

	it( 'should return an Axios instance that has a timeout set', () => {
		const mockRepo = 'http://test.wiki.example.com/w';
		const mockTimeout = 123;
		const mockUserAgentString = 'Secret Agent 1.0';
		const mockRepoHostAlias = 'http://reverse.proxy.test';

		const createMock = jest.spyOn( axiosLib, 'create' );
		axiosFactory( mockRepo, mockRepoHostAlias, mockTimeout, mockUserAgentString );

		expect( createMock.mock.calls[ 0 ][ 0 ]!.timeout ).toEqual( 123 );
	} );

	it( 'should add a Host header corresponding to the non-aliased Repo', () => {
		const mockRepo = 'http://test.wiki.example.com:1111/w';
		const mockTimeout = 123;
		const mockUserAgentString = 'Secret Agent 1.0';
		const mockRepoHostAlias = 'reverse.proxy.test';
		const axios = axiosFactory( mockRepo, mockRepoHostAlias, mockTimeout, mockUserAgentString );
		const axiosMock = new MockAdapter( axios );
		axiosMock.onGet( 'http://reverse.proxy.test:1111/w/foo' ).reply( StatusCodes.OK );
		return axios.get( '/foo' ).then( () => {
			expect( axiosMock.history.get[ 0 ].headers.Host ).toBe( 'test.wiki.example.com:1111' );
		} );
	} );

	it( 'contains the global default params in every request', async () => {
		const axios = axiosFactory(
			'https://my-repo/',
			'my-repo-alias',
			42,
			'some user agent',
		);
		const axiosMock = new MockAdapter( axios );

		axiosMock.onGet( '/' ).reply( StatusCodes.OK );

		await axios.get( '/' );

		expect( axiosMock.history.get[ 0 ].params ).toMatchObject( GLOBAL_REQUEST_PARAMS );
	} );
} );
