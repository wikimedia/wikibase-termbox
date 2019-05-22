import axios from 'axios';
import { GLOBAL_REQUEST_PARAMS } from '@/common/constants';

export const getAxios = ( wikibaseRepo: string, timeout: number, userAgentString: string ) => {
	return axios.create( {
		baseURL: wikibaseRepo,
		params: GLOBAL_REQUEST_PARAMS,
		timeout: timeout,
		headers: {
			'User-Agent': userAgentString,
		},
	} );
};
