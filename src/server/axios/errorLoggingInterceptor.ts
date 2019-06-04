import { AxiosError, AxiosResponse } from 'axios';
import AxiosErrorLogger from './AxiosErrorLogger';

export default function errorLoggingInterceptor( logger: AxiosErrorLogger ):
	[ ( r: AxiosResponse ) => AxiosResponse, ( e: AxiosError ) => void ] {
	return [
		( response: AxiosResponse ) => {
			return response;
		},
		( error: AxiosError ) => {
			logger.log( error );
			return Promise.reject( error );
		},
	];
}
