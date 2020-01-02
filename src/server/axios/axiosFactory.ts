import axios, { AxiosInstance } from 'axios';
import { GLOBAL_REQUEST_PARAMS } from '@/common/constants';
import { URL } from 'url';

export default function axiosFactory(
	wikibaseRepo: string,
	hostnameAlias: string,
	timeout: number,
	userAgentString: string,
): AxiosInstance {
	const baseUrl = new URL( wikibaseRepo );
	const hostHeader = baseUrl.host;
	baseUrl.hostname = hostnameAlias;

	return axios.create( {
		baseURL: baseUrl.toString(),
		params: GLOBAL_REQUEST_PARAMS,
		timeout,
		headers: {
			'User-Agent': userAgentString,
			'Host': hostHeader,
		},
	} );
}
