import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import MessageNotFound from '@/common/data-access/error/MessageNotFound';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';
import MessageCollection from '@/datamodel/MessageCollection';
import MessagesRepository from '@/common/data-access/MessagesRepository';
import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import { MessageKey } from '@/common/MessageKey';
import AxiosTechnicalProblem from '@/common/data-access/error/AxiosTechnicalProblem';

interface ResponseMessageSuccess {
	name: MessageKey;
	normalizedname: string;
	'*': string;
}

interface ResponseMessageMissing {
	name: MessageKey;
	missing: string;
}

type AllMessagesResponseMessage = ResponseMessageSuccess | ResponseMessageMissing;

export default class AxiosWikibaseMessagesRepo implements MessagesRepository {
	private axios: AxiosInstance;
	private messageKeys: MessageKey[];

	public constructor( axios: AxiosInstance, messageKeys: MessageKey[] ) {
		this.axios = axios;
		this.messageKeys = messageKeys;
	}

	public getMessagesInLanguage( inLanguage: string ): Promise<MessageTranslationCollection> {
		return new Promise( ( resolve, reject ) => {
			this.axios.get( MEDIAWIKI_API_SCRIPT, { params: {
				action: 'query',
				meta: 'allmessages',
				ammessages: this.messageKeys.join( '|' ),
				amlang: inLanguage,
			} } )
				.then( ( response: AxiosResponse ) => {
					const data = response.data;

					if ( typeof data !== 'object' || !( 'query' in data ) ) {
						reject( new TechnicalProblem( 'allmessages result not well formed.' ) );
						return;
					}

					if ( !( 'allmessages' in data.query ) ) {
						reject( new TechnicalProblem( 'allmessages result not well formed.' ) );
						return;
					}

					try {
						resolve( this.getMessageTranslationCollection( inLanguage, data.query.allmessages ) );
					} catch ( error ) {
						reject( error );
						return;
					}
				} )
				.catch( ( error: AxiosError ) => {
					reject( new AxiosTechnicalProblem( error ) );
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
				throw new MessageNotFound( `${value.name} is not a valid message-key.` );
			} else {
				messageList[ value.name ] = ( value as ResponseMessageSuccess )[ '*' ];
			}
		} );
		return messageList;
	}
}
