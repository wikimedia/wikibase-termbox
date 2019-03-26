import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';

/**
 * Returns an interceptor function adding CSRF tokens to all post requests.
 * Tokens are requested via MediaWiki's API.
 */
export default function editTokenRequestInterceptor( axios: AxiosInstance ) {
	return ( request: AxiosRequestConfig ): Promise<AxiosRequestConfig> => {
		if ( request.method !== 'post' ) {
			return Promise.resolve( request );
		}

		return new Promise( ( resolve, reject ) => {
			axios.get( MEDIAWIKI_API_SCRIPT, {
				params: {
					action: 'query',
					meta: 'tokens',
					type: 'csrf',
				},
			} ).then( ( response: AxiosResponse ) => {
				if ( response.data
					&& response.data.query
					&& response.data.query.tokens
					&& response.data.query.tokens.csrftoken ) {
					request.data.token = response.data.query.tokens.csrftoken;
					resolve( request );
				}

				reject( new TechnicalProblem( 'malformed CSRF token response' ) );
			} ).catch( ( error: AxiosError ) => {
				reject( new TechnicalProblem( error.toString() ) );
			} );
		} );
	};
}
