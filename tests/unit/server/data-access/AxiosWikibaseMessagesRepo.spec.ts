import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import MessagesNotFound from '@/common/data-access/error/MessageNotFound';
import AxiosWikibaseMessagesRepo from '@/server/data-access/AxiosWikibaseMessagesRepo';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import { MessageKey } from '@/common/MessageKey';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import { StatusCodes } from 'http-status-codes';
import AxiosTechnicalProblem from '@/common/data-access/error/AxiosTechnicalProblem';

const axiosMock = new MockAdapter( axios );

function newAxiosWikibaseMessagesRepo( messageKeys: MessageKey[] ) {
	return new AxiosWikibaseMessagesRepo(
		axios,
		messageKeys,
	);
}

describe( 'AxiosWikibaseMessagesRepo', () => {

	beforeEach( () => {
		axiosMock.reset();
	} );

	it( 'can be constructed with axios', () => {
		expect( newAxiosWikibaseMessagesRepo( Object.values( MessageKey ) ) )
			.toBeInstanceOf( AxiosWikibaseMessagesRepo );
	} );

	describe( 'getMessagesInLanguage', () => {
		it( 'with well-formed allmessages query resolves to messages on success', ( done ) => {
			const inLanguage = 'de';
			const messageKeys = [ MessageKey.EDIT, MessageKey.PUBLISH ];

			const messages: MessageTranslationCollection = {
				de: {
					'wikibase-edit': 'bearbeiten',
					'wikibase-publish': 'speichern',
				},
			};
			const results = {
				batchcomplete: '',
				query: {
					allmessages: [ {
						'name': 'wikibase-edit',
						'normalizedname': 'wikibase-edit',
						'*': 'bearbeiten',
					},
					{
						'name': 'wikibase-publish',
						'normalizedname': 'wikibase-publish',
						'*': 'speichern',
					} ],
				},
			};
			axiosMock.onGet( MEDIAWIKI_API_SCRIPT, { params: {
				action: 'query',
				meta: 'allmessages',
				ammessages: messageKeys.join( '|' ),
				amlang: inLanguage,
			} } ).reply( StatusCodes.OK, results );

			const repo = newAxiosWikibaseMessagesRepo( messageKeys );
			repo.getMessagesInLanguage( inLanguage ).then( ( resultMessages: any ) => {
				expect( resultMessages ).toStrictEqual( messages );
				done();
			} );
		} );

		it( 'rejects in case of unkown message-key', ( done ) => {
			const inLanguage = 'de';
			const results = {
				batchcomplete: '',
				query: {
					allmessages: [ {
						'name': 'wikibase-edit',
						'normalizedname': 'wikibase-edit',
						'*': 'bearbeiten',
					}, {
						name: 'foo',
						missing: '',
					} ],
				},
			};

			axiosMock.onGet().reply( StatusCodes.OK, results );

			const repo = newAxiosWikibaseMessagesRepo( [ 'wikibase-edit', 'foo' ] as MessageKey[] );
			repo.getMessagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( MessagesNotFound );
				expect( reason.message ).toEqual( 'foo is not a valid message-key.' );
				done();
			} );
		} );

		it( 'rejects on result that does not contain an object', ( done ) => {
			const inLanguage = 'de';
			axiosMock.onGet().reply( StatusCodes.OK, '<some><random><html>' );

			const repo = newAxiosWikibaseMessagesRepo( Object.values( MessageKey ) );
			repo.getMessagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'allmessages result not well formed.' );
				done();
			} );
		} );

		it( 'rejects in case of a malformed API response (missing query)', ( done ) => {
			const inLanguage = 'de';
			const results = {
				strangebody: 'yes',
			};
			axiosMock.onGet().reply( StatusCodes.OK, results );

			const repo = newAxiosWikibaseMessagesRepo( Object.values( MessageKey ) );
			repo.getMessagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'allmessages result not well formed.' );
				done();
			} );
		} );

		it( 'rejects in case of a malformed API response (missing query.allmessages)', ( done ) => {
			const inLanguage = 'de';
			const results = {
				batchcomplete: '',
				query: {
					strangeprop: 'yes',
				},
			};
			axiosMock.onGet().reply( StatusCodes.OK, results );

			const repo = newAxiosWikibaseMessagesRepo( Object.values( MessageKey ) );
			repo.getMessagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'allmessages result not well formed.' );
				done();
			} );
		} );

		it( 'rejects stating the reason in case of API problems', ( done ) => {
			const inLanguage = 'de';
			axiosMock.onGet().reply( StatusCodes.INTERNAL_SERVER_ERROR, 'API problem' );

			const repo = newAxiosWikibaseMessagesRepo( Object.values( MessageKey ) );
			repo.getMessagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( AxiosTechnicalProblem );
				expect( ( reason as AxiosTechnicalProblem ).getContext().message )
					.toEqual( 'Request failed with status code 500' );
				done();
			} );
		} );
	} );
} );
