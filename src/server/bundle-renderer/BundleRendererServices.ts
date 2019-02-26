import { AxiosInstance } from 'axios';

interface Logger {
	log( ...things: any[] ): void;
}

export default class BundleRendererServices {
	public readonly axios: AxiosInstance;
	public readonly logger: Logger;

	public constructor( axios: AxiosInstance, logger: Logger ) {
		this.axios = axios;
		this.logger = logger;
	}
}
