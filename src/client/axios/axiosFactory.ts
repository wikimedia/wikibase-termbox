import Axios, { AxiosInstance } from 'axios';
import { GLOBAL_REQUEST_PARAMS } from '@/common/constants';
import formDataRequestTransformation from './formDataRequestTransformation';
import editTokenRequestInterceptor from './editTokenRequestInterceptor';
import assertUserRequestInterceptor from '@/client/axios/assertUserRequestInterceptor';

export const getAxios = ( baseUrl: string, username: string | null ): AxiosInstance => {
	const axios = Axios.create( {
		baseURL: baseUrl,
		params: GLOBAL_REQUEST_PARAMS,
		transformRequest: formDataRequestTransformation,
	} );
	axios.interceptors.request.use( editTokenRequestInterceptor( axios ) );
	axios.interceptors.request.use( assertUserRequestInterceptor( username ) );
	return axios;
};
