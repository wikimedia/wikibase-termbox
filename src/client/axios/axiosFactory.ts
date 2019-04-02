import Axios, { AxiosInstance } from 'axios';
import { GLOBAL_REQUEST_PARAMS } from '@/common/constants';
import formDataRequestTransformation from './formDataRequestTransformation';
import editTokenRequestInterceptor from './editTokenRequestInterceptor';

export const getAxios = ( baseUrl: string ): AxiosInstance => {
	const axios = Axios.create( {
		baseURL: baseUrl,
		params: GLOBAL_REQUEST_PARAMS,
		transformRequest: formDataRequestTransformation,
	} );
	axios.interceptors.request.use( editTokenRequestInterceptor( axios ) );
	return axios;
};
