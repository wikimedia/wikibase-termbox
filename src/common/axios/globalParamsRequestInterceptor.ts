import { AxiosRequestConfig } from 'axios';
import { GLOBAL_REQUEST_PARAMS } from '@/common/constants';

export default function ( request: AxiosRequestConfig ): AxiosRequestConfig {
	request.params = {
		...request.params,
		...GLOBAL_REQUEST_PARAMS,
	};

	return request;
}
