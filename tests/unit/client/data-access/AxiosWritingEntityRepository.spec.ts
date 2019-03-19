import AxiosWritingEntityRepository from '@/client/data-access/AxiosWritingEntityRepository';
import newFingerprintable from '../../../newFingerprintable';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import HttpStatus from 'http-status-codes';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';

const axiosMock = new MockAdapter( axios );

function newAxiosWritingEntityRepository() {
	return new AxiosWritingEntityRepository( axios );
}

describe( 'AxiosWritingEntityRepository', () => {

	beforeEach( () => {
		axiosMock.reset();
	} );

	it( 'posts data via wbeditentity', () => {
		const repository = newAxiosWritingEntityRepository();
		const entity = newFingerprintable( {
			id: 'Q16587531',
			labels: { en: 'potato', de: 'Kartoffel' },
			descriptions: { en: 'root vegetable' },
			aliases: { de: [ 'Erdapfel', 'Grundbirne' ] },
		} );

		axiosMock.onPost( MEDIAWIKI_API_SCRIPT, {
			action: 'wbeditentity',
			id: entity.id,
			data: JSON.stringify( {
				labels: entity.labels,
				descriptions: entity.descriptions,
				aliases: entity.aliases,
			} ),
		} ).reply( HttpStatus.OK, {
			success: 1,
			entity: {
				// ...
			},
		} );

		return repository.saveEntity( entity, /* TODO */ 0 ).then( () => {
			expect( axiosMock.history.post ).toHaveLength( 1 );
		} );
	} );

	it( 'rejects with TechnicalProblem given the API does not return a success response', () => {
		const repository = newAxiosWritingEntityRepository();
		const entity = newFingerprintable( {
			id: 'Q321',
			labels: { en: 'meow' },
		} );
		axiosMock.onPost( MEDIAWIKI_API_SCRIPT, {
			action: 'wbeditentity',
			id: entity.id,
			data: JSON.stringify( {
				labels: entity.labels,
				descriptions: entity.descriptions,
				aliases: entity.aliases,
			} ),
		} ).reply( HttpStatus.OK, {
			error: {
				code: 'invalid-json',
			},
		} );

		return repository.saveEntity( entity, /* TODO */ 0 ).catch( ( error ) => {
			expect( error ).toBeInstanceOf( TechnicalProblem );
		} );
	} );

	it( 'rejects with TechnicalProblem given the API request fails', () => {
		const repository = newAxiosWritingEntityRepository();
		const entity = newFingerprintable( {
			id: 'Q321',
			labels: { en: 'meow' },
		} );
		axiosMock.onAny().networkError();

		return repository.saveEntity( entity, /* TODO */ 0 ).catch( ( error ) => {
			expect( error ).toBeInstanceOf( TechnicalProblem );
		} );
	} );

} );
