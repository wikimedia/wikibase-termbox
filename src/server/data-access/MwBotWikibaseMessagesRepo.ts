import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import MessageNotFound from '@/common/data-access/error/MessageNotFound';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import MessageCollection from '@/datamodel/MessageCollection';
import MessagesRepository from '@/common/data-access/MessagesRepository';
import mwbot from 'mwbot';

interface ResponseMessageSuccess {
	name: string;
	normalizedname: string;
	'*': string;
}

interface ResponseMessageMissing {
	name: string;
	missing: string;
}

type AllMessagesResponseMessage = ResponseMessageSuccess | ResponseMessageMissing;

export default class MwBotWikibaseMessagesRepo implements MessagesRepository {
	private bot: mwbot;
	private messageKeys: string[];

	public constructor( bot: mwbot, messageKeys: string[] ) {
		this.bot = bot;
		this.messageKeys = messageKeys;
	}

	public getMessagesInLanguage( inLanguage: string ): Promise<MessageTranslationCollection> {
		return new Promise( ( resolve, reject ) => {
			this.bot.request( {
				action: 'query',
				meta: 'allmessages',
				ammessages: this.messageKeys.join( '|' ),
				amlang: inLanguage,
			} )
				.then( ( response: any ) => {
					if ( !( 'query' in response ) ) {
						reject( new TechnicalProblem( 'allmessages result not well formed.' ) );
						return;
					}

					if ( !( 'allmessages' in response.query ) ) {
						reject( new TechnicalProblem( 'allmessages result not well formed.' ) );
						return;
					}

					try {
						resolve( this.getMessageTranslationCollection( inLanguage, response.query.allmessages ) );
					} catch ( error ) {
						reject( error );
						return;
					}
				} )
				.catch( ( reason: string ) => {
					reject( new TechnicalProblem( reason ) );
				} );
		} );
	}

	private getMessageTranslationCollection(
		inLanguage: string,
		response: AllMessagesResponseMessage[],
	): MessageTranslationCollection {
		return {
			[ inLanguage ]: this.transformMessages( response ),
		};
	}

	private transformMessages( response: AllMessagesResponseMessage[] ): MessageCollection {
		const messageList: MessageCollection = {};
		response.forEach( ( value: ResponseMessageSuccess | ResponseMessageMissing ) => {
			if ( 'missing' in value ) {
				throw new MessageNotFound( `${ value.name } is not a valid message-key.` );
			} else {
				messageList[ value.name ] = ( value as ResponseMessageSuccess )['*'];
			}
		} );
		return messageList;
	}
}
