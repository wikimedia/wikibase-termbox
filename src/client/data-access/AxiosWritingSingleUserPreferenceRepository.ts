import { WritingSingleUserPreferenceRepository } from '@/common/data-access/SingleUserPreferenceRepository';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';

/**
 * This repository can only be used for logged in users.
 */
export default class AxiosWritingSingleUserPreferenceRepository implements
	WritingSingleUserPreferenceRepository<string> {
	private optionName: string;
	private axios: AxiosInstance;

	public constructor( optionName: string, axios: AxiosInstance ) {
		this.optionName = optionName;
		this.axios = axios;
	}

	public setPreference( value: string ): Promise<void> {
		return new Promise( ( resolve, reject ) => {
			this.axios.post( MEDIAWIKI_API_SCRIPT, {
				action: 'options',
				optionname: this.optionName,
				optionvalue: value,
			} ).then( ( response: AxiosResponse ) => {
				if ( response.data.options === 'success' ) {
					resolve();
				} else {
					reject( new TechnicalProblem( response.data ) );
				}
			} ).catch( ( error: AxiosError ) => {
				reject( new TechnicalProblem( error.toString() ) );
			} );
		} );
	}

}
