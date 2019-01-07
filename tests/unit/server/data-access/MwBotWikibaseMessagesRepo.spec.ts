import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import MessagesNotFound from '@/common/data-access/error/MessageNotFound';
import MwBotWikibaseMessagesRepo from '@/server/data-access/MwBotWikibaseMessagesRepo';
import mwbot from 'mwbot';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import { MessageKeys } from '@/common/MessageKeys';

function newMwBotWikibaseMessagesRepo( bot: any, messageKeys: string[] ) {
	return new MwBotWikibaseMessagesRepo(
		bot,
		messageKeys,
	);
}

describe( 'MwBotWikibaseMessagesRepo', () => {

	it( 'can be constructed with mwbot', () => {
		expect( newMwBotWikibaseMessagesRepo( new mwbot( {} ), Object.values( MessageKeys ) ) )
			.toBeInstanceOf( MwBotWikibaseMessagesRepo );
	} );

	describe( 'getMessagesInLanguage', () => {
		it( 'creates a well-formed allmessages query with amlang', ( done ) => {
			const inLanguage = 'de';
			const messageKeys = Object.values( MessageKeys );
			const bot = {
				request: ( params: object ) => {
					expect( params ).toEqual( {
						action: 'query',
						meta: 'allmessages',
						ammessages: messageKeys.join( '|' ),
						amlang: inLanguage,
					} );

					return Promise.reject( 'This test focuses on the request.' );
				},
			};

			const repo = newMwBotWikibaseMessagesRepo( bot, messageKeys );
			repo.getMessagesInLanguage( inLanguage ).catch( () => {
				done();
			} );
		} );

		it( 'resolves to messages on success', ( done ) => {
			const inLanguage = 'de';
			const messages: MessageTranslationCollection = {
				de: {
					'wikibase-edit': 'bearbeiten',
				},
			};
			const results = {
				batchcomplete: '',
				query: {
					allmessages: [ {
						'name': 'wikibase-edit',
						'normalizedname': 'wikibase-edit',
						'*': 'bearbeiten',
					} ],
				},
			};
			const bot = {
				request: ( params: object ) => {
					return Promise.resolve( results );
				},
			};

			const repo = newMwBotWikibaseMessagesRepo( bot, [ 'wikibase-edit' ] );
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
					}],
				},
			};

			const bot = {
				request: ( params: object ) => {
					return Promise.resolve( results );
				},
			};

			const repo = newMwBotWikibaseMessagesRepo( bot, [ 'wikibase-edit', 'foo' ] );
			repo.getMessagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( MessagesNotFound );
				expect( reason.message ).toEqual( 'foo is not a valid message-key.' );
				done();
			} );
		} );

		it( 'rejects in case of a malformed API response (missing query)', ( done ) => {
			const inLanguage = 'de';
			const results = {
				strangebody: 'yes',
			};
			const bot = {
				request: ( params: object ) => {
					return Promise.resolve( results );
				},
			};

			const repo = newMwBotWikibaseMessagesRepo( bot, Object.values( MessageKeys ) );
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
			const bot = {
				request: ( params: object ) => {
					return Promise.resolve( results );
				},
			};

			const repo = newMwBotWikibaseMessagesRepo( bot, Object.values( MessageKeys ) );
			repo.getMessagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'allmessages result not well formed.' );
				done();
			} );
		} );

		it( 'rejects stating the reason in case of API problems', ( done ) => {
			const inLanguage = 'de';
			const bot = {
				request: ( params: object ) => {
					return Promise.reject( new Error( 'invalidjson: No valid JSON response.' ) );
				},
			};
			const repo = newMwBotWikibaseMessagesRepo( bot, Object.values( MessageKeys ) );
			repo.getMessagesInLanguage( inLanguage ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'Error: invalidjson: No valid JSON response.' );
				done();
			} );
		} );
	} );
} );
