import { AxiosError } from 'axios';
import LoggableError from '@/common/error/LoggableError';

type AxiosErrorContext = {
	message: string;
	request?: {
		headers: object;
		url?: string;
		params: unknown;
	};
	response?: {
		status: number;
		statusText: string;
		headers: object;
		data: unknown;
	};
};

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
				headers: this.error.config.headers,
				url: this.error.config.url,
				params: this.error.config.params,
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
