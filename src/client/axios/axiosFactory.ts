import Axios, { AxiosInstance } from 'axios';
import formDataRequestTransformation from './formDataRequestTransformation';
import editTokenRequestInterceptor from './editTokenRequestInterceptor';
import assertUserRequestInterceptor from '@/client/axios/assertUserRequestInterceptor';
import globalParamsRequestInterceptor from '@/common/axios/globalParamsRequestInterceptor';

export default function axiosFactory( baseUrl: string, username: string | null ): AxiosInstance {
	const axios = Axios.create( {
		baseURL: baseUrl,
		transformRequest: formDataRequestTransformation,
	} );
	axios.interceptors.request.use( editTokenRequestInterceptor( axios ) );
	axios.interceptors.request.use( assertUserRequestInterceptor( username ) );
	axios.interceptors.request.use( globalParamsRequestInterceptor );

	return axios;
}
