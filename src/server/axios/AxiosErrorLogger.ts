import Logger, { LogLevel } from '@/server/Logger';
import { AxiosError } from 'axios';

export default class AxiosErrorLogger {
	private logger: Logger;
	private readonly level: LogLevel;

	public constructor( logger: Logger, level: LogLevel ) {
		this.logger = logger;
		this.level = level;
	}

	public log( error: AxiosError ) {
		const response = error.response;
		const request = error.request;
		const payload = { message: error.message } as any;
		if ( request !== undefined ) {
			payload.request = {
				// eslint-disable-next-line no-underscore-dangle
				headers: error.request._headers,
				path: error.request.path,
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
		this.logger.log( this.level, payload );
	}
}
