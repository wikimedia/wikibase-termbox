import request from 'supertest';
import mockQ64 from '@/mock-data/data/Q64_data.json';
import openApiJson from '@/../openapi.json';
import createApp from '@/server/app';
import nock from 'nock';
import 'jest-dom/extend-expect';
import { StatusCodes } from 'http-status-codes';
import messages from '@/mock-data/data/de_messages_data.json';
import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { MessageKey } from '@/common/MessageKey';
/**
 * arguably we could not add GLOBAL_REQUEST_PARAMS to neither axios (building the request)
 * nor nock (mocking the response) but this way it is closer to reality (cf. server.ts)
 */
import { MEDIAWIKI_API_SCRIPT, MEDIAWIKI_INDEX_SCRIPT, GLOBAL_REQUEST_PARAMS } from '@/common/constants';
import AxiosSpecialPageEntityRepo from '@/server/data-access/AxiosSpecialPageEntityRepo';
import CoercingQueryValidator from '@/server/route-handler/termbox/CoercingQueryValidator';
import OpenAPIRequestCoercer from 'openapi-request-coercer';
import OpenAPIRequestValidator from 'openapi-request-validator';
import Metrics from '@/server/Metrics';
import qs from 'querystring';
import { TermList } from '@wmde/wikibase-datamodel-types';
import MessageCollection from '@/datamodel/MessageCollection';
import globalRequestParamsInterceptor from '@/common/axios/globalParamsRequestInterceptor';

const WIKIBASE_TEST_HOST = 'http://mw.testonly.localhost';
const WIKIBASE_TEST_API_PATH = `/${MEDIAWIKI_API_SCRIPT}`;
const WIKIBASE_TEST_INDEX_PATH = `/${MEDIAWIKI_INDEX_SCRIPT}`;

const logger = {
	log: jest.fn(),
};
const metrics: Metrics = {
	timing: jest.fn(),
	normalizeName: jest.fn(),
};

const messageCache = { has: jest.fn(), set: jest.fn(), get: jest.fn() };
const languageCache = { has: jest.fn(), set: jest.fn(), get: jest.fn() };

const termboxSpecParameters = openApiJson.paths[ '/termbox' ].get.parameters;
const testAxios = axios.create( {
	baseURL: WIKIBASE_TEST_HOST,
	adapter: httpAdapter, // https://github.com/axios/axios/issues/305#issuecomment-272162405
} );
testAxios.interceptors.request.use( globalRequestParamsInterceptor );

const services = new BundleRendererServices(
	testAxios,
	logger,
	metrics,
	messageCache as any,
	languageCache as any,
	new CoercingQueryValidator(
		new OpenAPIRequestCoercer( {
			parameters: termboxSpecParameters,
		} ),
		new OpenAPIRequestValidator( {
			parameters: termboxSpecParameters,
		} ),
	),
	openApiJson,
);

const app = createApp( services );

const germanInGerman = 'Deutsch';

// there is no magic behind these (request and response mocked); tries to reduce magic numbers, improve readability
const REVISION_MATCHING_ENTITY = 4711;
const REVISION_NOT_MATCHING_ENTITY = 815;

function getDomFromMarkup( markup: string ): HTMLElement {
	const newNode = document.createElement( 'div' );
	newNode.innerHTML = markup;
	return newNode;
}

function nockSuccessfulLanguageLoading( inLanguage: string ) {
	nock( WIKIBASE_TEST_HOST )
		.get( WIKIBASE_TEST_API_PATH )
		.query( {
			action: 'query',
			meta: 'wbcontentlanguages',
			wbclcontext: 'term',
			wbclprop: 'code|name',
			uselang: inLanguage,
			...GLOBAL_REQUEST_PARAMS,
		} )
		.reply( StatusCodes.OK, {
			batchcomplete: '',
			query: {
				wbcontentlanguages: {
					en: {
						code: 'en',
						name: 'Englisch',
					},
					de: {
						code: 'de',
						name: germanInGerman,
					},
					fr: {
						code: 'fr',
						name: 'Français',
					},
					'es-419': {
						code: 'es-419',
						name: 'español de América Latina',
					},
				},
			},
		} );
}

function getApiResponseMessages( keys: MessageKey[] ) {
	return keys.map( ( key ) => ( {
		'name': key,
		'normalizedname': key,
		'*': ( messages as MessageCollection )[ key ],
	} ) );
}

function nockSuccessfulMessagesLoading( inLanguage: string ) {
	const messageKeys = Object.values( MessageKey );
	nock( WIKIBASE_TEST_HOST )
		.get( WIKIBASE_TEST_API_PATH )
		.query( {
			action: 'query',
			meta: 'allmessages',
			ammessages: messageKeys.join( '|' ),
			amlang: inLanguage,
			...GLOBAL_REQUEST_PARAMS,
		} )
		.reply( StatusCodes.OK, {
			batchcomplete: '',
			query: {
				allmessages: getApiResponseMessages( messageKeys ),
			},
		} );
}

function nockSuccessfulEntityLoading( entityId: string, revision: number ) {
	nock( WIKIBASE_TEST_HOST )
		.get( WIKIBASE_TEST_INDEX_PATH )
		.query( {
			id: entityId,
			revision,
			title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
			...GLOBAL_REQUEST_PARAMS,
		} )
		.reply( StatusCodes.OK, {
			entities: {
				[ entityId ]: mockQ64, // TODO build dynamic mock response if needed
			},
		} );
}

function expectLabelInLanguage( $fingerprint: Element, language: string, directionality = 'ltr' ) {
	const $label = $fingerprint.querySelector( '.wb-ui-label' );
	expect( $label ).toHaveTextContent( ( mockQ64.labels as TermList )[ language ].value );
	expect( $label ).toBeInstanceOf( Element );
	expect( $label!.getAttribute( 'lang' ) ).toBe( language );
	expect( $label!.getAttribute( 'dir' ) ).toBe( directionality );
}

function expectSuccessfulRequest( response: request.Response ) {
	expect( response.status ).toBe( 200 );
	expect( logger.log ).not.toBeCalled();
}

describe( 'Termbox SSR', () => {
	afterEach( () => {
		nock.cleanAll();
		nock.enableNetConnect();
	} );

	it( 'renders Server Error when requesting /termbox and entity backend emits malformed response', () => {
		const entityId = 'Q64';
		const revision = REVISION_MATCHING_ENTITY;
		const language = 'de';
		const editLink = `/some/${entityId}`;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';
		const pathAndQuery = `/termbox?${qs.stringify( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} )}`;

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_INDEX_PATH )
			.query( {
				id: entityId,
				revision,
				title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( StatusCodes.OK, {
				malformed: 'yes',
			} );

		return request( app ).get( pathAndQuery ).then( ( response ) => {
			expect( response.status ).toBe( StatusCodes.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );

			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[ 0 ][ 0 ] ).toBe( 'error/service' );

			const errorContext = logger.log.mock.calls[ 0 ][ 1 ];
			expect( errorContext.message ).toBe( 'result not well formed.' );
			expect( errorContext.url ).toContain( pathAndQuery );
		} );
	} );

	it( 'renders Server Error when requesting /termbox and entity backend request fails', ( done ) => {
		const entityId = 'Q64';
		const revision = REVISION_MATCHING_ENTITY;
		const language = 'de';
		const editLink = '/some';
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		const responseMessage = 'upstream system error';
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_INDEX_PATH )
			.query( {
				id: entityId,
				revision,
				title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( StatusCodes.INTERNAL_SERVER_ERROR, responseMessage );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( StatusCodes.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );

			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[ 0 ][ 0 ] ).toBe( 'error/service' );
			expect( logger.log.mock.calls[ 0 ][ 1 ].response.data ).toBe( responseMessage );

			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and language translation backend request fails', ( done ) => {
		const entityId = 'Q64';
		const revision = REVISION_MATCHING_ENTITY;
		const language = 'de';
		const editLink = `/some/${entityId}`;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';

		const responseText = 'upstream system error';
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_API_PATH )
			.query( {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				uselang: language,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( StatusCodes.INTERNAL_SERVER_ERROR, responseText );
		nockSuccessfulMessagesLoading( language );
		nockSuccessfulEntityLoading( entityId, revision );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( StatusCodes.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );

			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[ 0 ][ 0 ] ).toBe( 'error/service' );
			expect( logger.log.mock.calls[ 0 ][ 1 ].response.data ).toBe( responseText );

			done();
		} );
	} );

	it( 'renders Server Error when requesting /termbox and message backend request fails', ( done ) => {
		const entityId = 'Q64';
		const revision = REVISION_MATCHING_ENTITY;
		const language = 'de';
		const responseText = 'upstream system error';

		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_API_PATH )
			.query( {
				action: 'query',
				meta: 'allmessages',
				ammessages: Object.values( MessageKey ).join( '|' ),
				amlang: language,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( StatusCodes.INTERNAL_SERVER_ERROR, responseText );
		nockSuccessfulEntityLoading( entityId, revision );
		nockSuccessfulLanguageLoading( language );

		request( app ).get( '/termbox' ).query( {
			entity: entityId,
			revision,
			language,
			editLink: `/some/${entityId}`,
			preferredLanguages: 'de|en|pl|zh|fr|ar',
		} ).then( ( response ) => {
			expect( response.status ).toBe( StatusCodes.INTERNAL_SERVER_ERROR );
			expect( response.text ).toContain( 'Technical problem' );

			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[ 0 ][ 0 ] ).toBe( 'error/service' );
			expect( logger.log.mock.calls[ 0 ][ 1 ].response.data ).toBe( responseText );

			done();
		} );
	} );

	it.each( [
		[
			{}, // all empty
			[ 'entity', 'revision', 'language', 'editLink', 'preferredLanguages' ],
		],
		[
			{
				entity: 'Q3',
				revision: 31510,
				preferredLanguages: 'de|fe|zh|tw',
				editLink: '/somewhere/Q2',
			},
			[ 'language' ],
		],
		[
			{
				revision: 31510,
				language: 'de',
				preferredLanguages: 'de|fe|zh|tw',
				editLink: '/somewhere/Q2',
			},
			[ 'entity' ],
		],
		[
			{
				entity: 'Q3',
				revision: 31510,
				language: 'de',
				editLink: '/somewhere/Q2',
			},
			[ 'preferredLanguages' ],
		],
		[
			{ // empty strings
				entity: '',
				revision: '',
				language: '',
				preferredLanguages: '',
				editLink: '',
			},
			[ 'entity', 'revision', 'language', 'preferredLanguages[0]' ],
		],
		[
			{ // evil strings
				entity: ' ',
				revision: '  ',
				language: '      ',
				preferredLanguages: '	', // eslint-disable-line no-tabs
				editLink: '',
			},
			[ 'entity', 'revision', 'language', 'preferredLanguages[0]' ],
		],
		[
			{
				entity: [ 'bad', 'value' ], // off-type value
				revision: 31510,
				language: 'de',
				editLink: '/somewhere/Q2',
				preferredLanguages: 'de|en',
			},
			[ 'entity' ],
		],
		[
			{
				entity: 'Q0', // crafted entity
				revision: 31510,
				language: 'de',
				editLink: '/somewhere/Q2',
				preferredLanguages: 'de|en',
			},
			[ 'entity' ],
		],
		[
			{ entity: 'Q2', language: 'de', editLink: '/somewhere/Q2', preferredLanguages: 'de|en' },
			[ 'revision' ],
		],
		[
			{
				entity: 'Q2',
				revision: 'foo',
				language: 'de',
				editLink: '/somewhere/Q2',
				preferredLanguages: 'de|en',
			},
			[ 'revision' ],
		],
		[
			{
				entity: 'Q2',
				revision: 31510,
				language: 'de',
				editLink: '/somewhere/Q2',
				preferredLanguages: 'de|en-x-excessivelylongextensionthathasaverylimitedchanceofbeingvalid',
			},
			[ 'preferredLanguages[1]' ],
		],
	] )(
		'renders Bad Request when requesting /termbox with defunct query #%# (%o) having known faults (%o)',
		( query: object, reasons: string[] ) => {
			const pathAndQuery = `/termbox?${qs.stringify( query )}`;

			return request( app ).get( pathAndQuery ).then( ( response ) => {
				expect( response.status ).toBe( StatusCodes.BAD_REQUEST );
				expect( response.text ).toContain( 'Bad request' );
				const errors = JSON.parse( response.text.match( '.*Errors: (.+)' )![ 1 ]! ).errors;
				expect( errors.map( ( e: any ) => e.path ).sort() ).toEqual( reasons.sort() );

				// this should never happen™ in combination with a well-configured wb, consequently we log this anomaly
				expect( logger.log ).toHaveBeenCalledTimes( 1 );
				expect( logger.log.mock.calls[ 0 ][ 0 ] ).toBe( 'info/service' );

				const errorContext = logger.log.mock.calls[ 0 ][ 1 ];
				expect( errorContext.url ).toContain( pathAndQuery );
				expect( errorContext.errors.map( ( e: any ) => e.path ).sort() ).toEqual( reasons.sort() );
			} );
		},
	);

	it( 'renders Bad request when requesting /termbox with well-formed query for unknown language', ( done ) => {
		const entityId = 'Q64';
		const revision = REVISION_MATCHING_ENTITY;
		const language = 'ylq';
		const editLink = `/some/${entityId}`;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';
		const pathAndQuery = `/termbox?${qs.stringify( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} )}`;

		nockSuccessfulEntityLoading( entityId, revision );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_API_PATH )
			.query( {
				action: 'query',
				meta: 'wbcontentlanguages',
				wbclcontext: 'term',
				wbclprop: 'code|name',
				uselang: language,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( StatusCodes.OK, {
				batchcomplete: '',
				query: {
					wbcontentlanguages: {
						en: {
							code: 'en',
							name: 'English',
						},
						de: {
							code: 'de',
							name: 'German',
						},
					},
				},
			} );

		request( app ).get( pathAndQuery ).then( ( response ) => {
			expect( response.status ).toBe( StatusCodes.BAD_REQUEST );
			expect( response.text ).toContain( 'Bad request. Language not existing' );

			// this should never happen™ in combination with a well-configured wb, consequently we log this anomaly
			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[ 0 ][ 0 ] ).toBe( 'info/service' );

			const errorContext = logger.log.mock.calls[ 0 ][ 1 ];
			expect( errorContext.requestedLanguage ).toBe( language );
			expect( errorContext.url ).toContain( pathAndQuery );
			done();
		} );
	} );

	it( 'renders Not found when requesting /termbox with well-formed query for unknown entity', () => {
		const entityId = 'Q63';
		const revision = REVISION_NOT_MATCHING_ENTITY;
		const language = 'de';
		const editLink = `/some/${entityId}`;
		const preferredLanguages = 'de|en|pl|zh|fr|ar';
		const backendErrorMessage = '<html><body><h1>Not Found</h1></body></html>';
		const pathAndQuery = `/termbox?${qs.stringify( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} )}`;

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_INDEX_PATH )
			.query( {
				id: entityId,
				revision,
				title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( StatusCodes.NOT_FOUND, backendErrorMessage );

		return request( app ).get( pathAndQuery ).then( ( response ) => {
			expect( response.status ).toBe( StatusCodes.NOT_FOUND );
			expect( response.text ).toContain( 'Entity not found' );

			// this should never happen™ in combination with a well-configured wb, consequently we log this anomaly
			expect( logger.log ).toHaveBeenCalledTimes( 1 );
			expect( logger.log.mock.calls[ 0 ][ 0 ] ).toBe( 'info/service' );

			const errorContext = logger.log.mock.calls[ 0 ][ 1 ];
			expect( errorContext.entity ).toBe( entityId );
			expect( errorContext.revision ).toBe( revision );
			expect( errorContext.url ).toContain( pathAndQuery );
		} );
	} );

	it( 'renders Not found when requesting /termbox with well-formed query for revision not matching entity', () => {
		const entityId = 'Q64';
		const revision = REVISION_NOT_MATCHING_ENTITY;
		const language = 'de';
		const editLink = `/some/${entityId}`;
		const preferredLanguages = 'de|en';
		const backendErrorMessage = `<h1>Not Found</h1><p>Can't show revision ${revision} of entity ${entityId}.</p>`;

		nockSuccessfulLanguageLoading( language );
		nockSuccessfulMessagesLoading( language );
		nock( WIKIBASE_TEST_HOST )
			.get( WIKIBASE_TEST_INDEX_PATH )
			.query( {
				id: entityId,
				revision,
				title: AxiosSpecialPageEntityRepo.SPECIAL_PAGE,
				...GLOBAL_REQUEST_PARAMS,
			} )
			.reply( StatusCodes.NOT_FOUND, backendErrorMessage );

		return request( app ).get( '/termbox' ).query( {
			entity: entityId,
			revision,
			language,
			editLink,
			preferredLanguages,
		} ).then( ( response ) => {
			expect( response.status ).toBe( StatusCodes.NOT_FOUND );
			expect( response.text ).toContain( 'Entity not found' );
		} );
	} );

	describe( 'successful /termbox request for a known entity', () => {

		it( 'renders the primary MonolingualFingerprintView component in the requested language', () => {
			const entityId = 'Q64';
			const revision = REVISION_MATCHING_ENTITY;
			const language = 'de';
			const editLink = `/some/${entityId}`;

			nockSuccessfulLanguageLoading( language );
			nockSuccessfulMessagesLoading( language );
			nockSuccessfulEntityLoading( entityId, revision );

			return request( app ).get( '/termbox' ).query( {
				entity: entityId,
				revision,
				language,
				editLink,
				preferredLanguages: language,
			} ).then( ( response ) => {
				expectSuccessfulRequest( response );

				const $dom = getDomFromMarkup( response.text );

				expect( $dom.querySelectorAll( '.wb-ui-termbox' ).length ).toBe( 1 );

				const $primaryLanguageMonolingualFingerprintView = $dom
					.querySelector( '.wb-ui-monolingualfingerprintview--primaryLanguage' );
				expect( $primaryLanguageMonolingualFingerprintView )
					.toBeVisible();

				const $language = $dom.querySelector( '.wb-ui-monolingualfingerprintview__language' );
				expect( $language ).toHaveTextContent( germanInGerman );

				expectLabelInLanguage( $primaryLanguageMonolingualFingerprintView!, language );

				const $description = $dom.querySelector( '.wb-ui-description' );
				expect( $description ).toHaveTextContent( mockQ64.descriptions.de.value );
				expect( $description!.getAttribute( 'lang' ) ).toBe( language );
				expect( $description!.getAttribute( 'dir' ) ).toBe( 'ltr' );

				const $aliases = $dom.querySelector( '.wb-ui-aliases' );
				expect( $aliases!.getAttribute( 'lang' ) ).toBe( language );
				expect( $aliases!.getAttribute( 'dir' ) ).toBe( 'ltr' );
				expect( $aliases!.querySelectorAll( 'li' ) ).toHaveLength( mockQ64.aliases.de.length );

				expect( $dom.querySelector( '.wb-ui-event-emitting-button--edit' ) )
					.toHaveAttribute( 'href', editLink );
			} );
		} );

		it( 'renders the "in more languages" section for other preferred languages', () => {
			const entityId = 'Q64';
			const revision = REVISION_MATCHING_ENTITY;
			const language = 'de';
			const preferredLanguages = 'de|en|fr';
			const secondaryLanguages = [ 'en', 'fr' ];

			nockSuccessfulLanguageLoading( language );
			nockSuccessfulMessagesLoading( language );
			nockSuccessfulEntityLoading( entityId, revision );

			return request( app ).get( '/termbox' ).query( {
				entity: entityId,
				revision,
				language,
				editLink: `/some/${entityId}`,
				preferredLanguages,
			} ).then( ( response ) => {
				expectSuccessfulRequest( response );

				const $dom = getDomFromMarkup( response.text );
				const $moreLanguagesMonolingualFingerprintViews = $dom.querySelectorAll(
					'.wb-ui-in-more-languages .wb-ui-monolingualfingerprintview',
				);
				expect( $moreLanguagesMonolingualFingerprintViews ).toHaveLength( secondaryLanguages.length );

				expectLabelInLanguage( $moreLanguagesMonolingualFingerprintViews[ 0 ], secondaryLanguages[ 0 ] );
				expectLabelInLanguage( $moreLanguagesMonolingualFingerprintViews[ 1 ], secondaryLanguages[ 1 ] );
			} );
		} );

		it( 'does not render the "all entered languages" button or section', () => {
			const entity = 'Q64';
			const revision = REVISION_MATCHING_ENTITY;
			const language = 'de';

			nockSuccessfulLanguageLoading( language );
			nockSuccessfulMessagesLoading( language );
			nockSuccessfulEntityLoading( entity, revision );

			return request( app ).get( '/termbox' ).query( {
				entity,
				revision,
				language,
				editLink: `/some/${entity}`,
				preferredLanguages: 'de|en|fr',
			} ).then( ( response: request.Response ) => {
				expectSuccessfulRequest( response );
				expect(
					getDomFromMarkup( response.text ).querySelector( '.wb-ui-all-entered-languages' ),
				).toBeNull();
			} );
		} );

		it( 'does not fail for language codes containing numeric characters', () => {
			const entity = 'Q64';
			const revision = REVISION_MATCHING_ENTITY;
			const language = 'es-419';

			nockSuccessfulLanguageLoading( language );
			nockSuccessfulMessagesLoading( language );
			nockSuccessfulEntityLoading( entity, revision );

			return request( app ).get( '/termbox' ).query( {
				entity,
				revision,
				language,
				editLink: `/some/${entity}`,
				preferredLanguages: language,
			} ).then( ( response: request.Response ) => {
				expectSuccessfulRequest( response );
			} );
		} );
	} );

} );

describe( 'Open API Spec', () => {
	it( 'returns a spec when passing spec query param to /', () => {
		return request( app ).get( '/' ).query( {
			spec: 'foo',
		} ).then( ( response ) => {
			expect( JSON.parse( response.text ).info.title ).toBe( 'wikibase-termbox' );
		} );
	} );
} );

describe( 'Information endpoint', () => {
	it( 'returns an info blob at /_info', () => {
		return request( app ).get( '/_info' )
			.then( ( response ) => {
				const jsonReply = JSON.parse( response.text );
				expect( jsonReply.name ).toBeDefined();
				expect( jsonReply.version ).toBeDefined();
			} );
	} );

	it( 'returns an info blob with only name at /_info/name', () => {
		return request( app ).get( '/_info/name' )
			.then( ( response ) => {
				const jsonReply = JSON.parse( response.text );
				expect( jsonReply.name ).toBeDefined();
				expect( Object.keys( jsonReply ).length ).toBe( 1 );
			} );
	} );

	it( 'returns an info blob with only version at /_info/version', () => {
		return request( app ).get( '/_info/version' )
			.then( ( response ) => {
				const jsonReply = JSON.parse( response.text );
				expect( jsonReply.version ).toBeDefined();
				expect( Object.keys( jsonReply ).length ).toBe( 1 );
			} );
	} );
} );
