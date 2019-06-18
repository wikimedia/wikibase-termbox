import { AxiosError } from 'axios';
import LoggableError from '@/common/error/LoggableError';

type AxiosErrorContext = {
	message: string;
	request?: {
		headers: object;
		path?: string;
	};
	response?: {
		status: number;
		statusText: string;
		headers: object;
		data: any;
	}
}

export default class AxiosTechnicalProblem extends Error implements LoggableError {
	private error: AxiosError;

	public constructor( error: AxiosError ) {
		super( 'request error' );
		this.error = error;
	}

	public getContext(): AxiosErrorContext {
		const response = this.error.response;
		const request = this.error.request;
		const payload: AxiosErrorContext = { message: this.error.message };
		if ( request !== undefined ) {
			payload.request = {
				// eslint-disable-next-line no-underscore-dangle
				headers: this.error.request._headers,
				path: this.error.request.path,
			};
		}
		if ( response !== undefined ) {
			payload.response = {
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
				data: response.data,
			};
		}

		return payload;
	}

}
