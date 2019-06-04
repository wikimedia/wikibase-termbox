import axios from 'axios';
import { GLOBAL_REQUEST_PARAMS } from '@/common/constants';
import { URL } from 'url';
import errorLoggingInterceptor from './errorLoggingInterceptor';
import AxiosErrorLogger from './AxiosErrorLogger';

export const getAxios = (
	wikibaseRepo: string,
	hostnameAlias: string,
	timeout: number,
	userAgentString: string,
	logger: AxiosErrorLogger,
) => {
	const baseUrl = new URL( wikibaseRepo );
	const hostHeader = baseUrl.host;
	baseUrl.hostname = hostnameAlias;
	const axiosInstance = axios.create( {
		baseURL: baseUrl.toString(),
		params: GLOBAL_REQUEST_PARAMS,
		timeout,
		headers: {
			'User-Agent': userAgentString,
			'Host': hostHeader,
		},
	} );
	axiosInstance.interceptors.response.use( ...errorLoggingInterceptor( logger ) );
	return axiosInstance;
};
