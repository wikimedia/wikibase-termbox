import { AxiosRequestConfig } from 'axios';

export default function assertUserRequestInterceptor( username: string | null ) {
	return ( request: AxiosRequestConfig ): AxiosRequestConfig => {
		if ( request.method === 'post' && username !== null ) {
			request.data.assertuser = username;
		}
		return request;
	};
}
