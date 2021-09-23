import AxiosWritingSingleUserPreferenceRepository
	from '@/client/data-access/AxiosWritingSingleUserPreferenceRepository';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';

const axiosMock = new MockAdapter( axios );

const optionsSuccessResponse = { options: 'success' };

describe( 'AxiosWritingSingleUserPreferenceRepository', () => {

	beforeEach( () => {
		axiosMock.reset();
	} );

	it( 'calls the API to write user option values', () => {
		const optionName = 'favorite-vegetable';
		const value = 'potato';

		const repo = new AxiosWritingSingleUserPreferenceRepository( optionName, axios );

		axiosMock.onPost( MEDIAWIKI_API_SCRIPT, {
			action: 'options',
			optionname: optionName,
			optionvalue: value,
		} ).reply( StatusCodes.OK, optionsSuccessResponse );

		return repo.setPreference( value ).then( () => {
			expect( axiosMock.history.post ).toHaveLength( 1 );
		} );
	} );

	it( 'rejects with TechnicalProblem given the API does not return a success response', () => {
		const repo = new AxiosWritingSingleUserPreferenceRepository( 'foo', axios );

		axiosMock.onPost( MEDIAWIKI_API_SCRIPT ).reply( StatusCodes.OK, { sadness: true } );

		return repo.setPreference( 'bar' ).catch( ( error ) => {
			expect( error ).toBeInstanceOf( TechnicalProblem );
		} );
	} );

	it( 'rejects with TechnicalProblem given the API request fails', () => {
		const repo = new AxiosWritingSingleUserPreferenceRepository( 'foo', axios );

		axiosMock.onPost( MEDIAWIKI_API_SCRIPT ).networkError();

		return repo.setPreference( 'bar' ).catch( ( error ) => {
			expect( error ).toBeInstanceOf( TechnicalProblem );
		} );
	} );

} );
