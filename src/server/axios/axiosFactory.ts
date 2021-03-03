import axios, { AxiosInstance } from 'axios';
import { URL } from 'url';
import globalRequestParamsInterceptor from '@/common/axios/globalParamsRequestInterceptor';

export default function axiosFactory(
	wikibaseRepo: string,
	hostnameAlias: string,
	timeout: number,
	userAgentString: string,
): AxiosInstance {
	const baseUrl = new URL( wikibaseRepo );
	const hostHeader = baseUrl.host;
	baseUrl.hostname = hostnameAlias;

	const axiosInstance = axios.create( {
		baseURL: baseUrl.toString(),
		timeout,
		headers: {
			'User-Agent': userAgentString,
			'Host': hostHeader,
		},
	} );

	axiosInstance.interceptors.request.use( globalRequestParamsInterceptor );

	return axiosInstance;
}
