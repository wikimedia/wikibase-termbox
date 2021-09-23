import AxiosWritingEntityRepository from '@/client/data-access/AxiosWritingEntityRepository';
import newFingerprintable from '../../../newFingerprintable';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import EntityRevision from '@/datamodel/EntityRevision';
import EntityInitializer from '@/common/EntityInitializer';

const axiosMock = new MockAdapter( axios );

function newAxiosWritingEntityRepository( {
	entityInitializer,
	tags,
}: {
	entityInitializer?: any;
	tags?: string[];
} = {} ) {
	return new AxiosWritingEntityRepository(
		axios,
		entityInitializer || { newFromSerialization: jest.fn() } as any as EntityInitializer,
		tags,
	);
}

const wbeditentitySuccessResponse = {
	success: 1,
	entity: {
		id: 'Q123',
		labels: {},
		descriptions: {},
		aliases: {},
		lastrevid: 0,
	},
};

describe( 'AxiosWritingEntityRepository', () => {

	beforeEach( () => {
		axiosMock.reset();
	} );

	it( 'posts data via wbeditentity', () => {
		const tags = [ 'tag 1', 'tag 2' ];
		const repository = newAxiosWritingEntityRepository( { tags } );
		const entity = newFingerprintable( {
			id: 'Q16587531',
			labels: { en: 'potato', de: 'Kartoffel' },
			descriptions: { en: 'root vegetable' },
			aliases: { de: [ 'Erdapfel', 'Grundbirne' ] },
		} );
		const baseRevisionId = 123;

		axiosMock.onPost( MEDIAWIKI_API_SCRIPT, {
			action: 'wbeditentity',
			id: entity.id,
			baserevid: baseRevisionId,
			data: JSON.stringify( {
				labels: entity.labels,
				descriptions: entity.descriptions,
				aliases: entity.aliases,
			} ),
			tags: '\u{1F}tag 1\u{1F}tag 2',
		} ).reply( StatusCodes.OK, wbeditentitySuccessResponse );

		return repository.saveEntity( entity, baseRevisionId ).then( () => {
			expect( axiosMock.history.post ).toHaveLength( 1 );
		} );
	} );

	it( 'returns an entity revision from a successful response', () => {
		const entityInitializer = {
			newFromSerialization: jest.fn(),
		};
		const repository = newAxiosWritingEntityRepository( { entityInitializer } );
		const entity = newFingerprintable( { labels: { en: 'hello' } } );
		const newRevisionId = 777;
		const responseEntity = {
			id: entity.id,
			labels: entity.labels,
			descriptions: entity.descriptions,
			aliases: entity.aliases,
			lastrevid: newRevisionId,
		};

		entityInitializer.newFromSerialization.mockReturnValue( entity );
		axiosMock.onPost( MEDIAWIKI_API_SCRIPT ).reply( StatusCodes.OK, {
			success: 1,
			entity: responseEntity,
		} );

		return repository.saveEntity( entity, 123 ).then( ( entityRevision: EntityRevision ) => {
			expect( entityInitializer.newFromSerialization ).toHaveBeenCalledWith( responseEntity );
			expect( entityRevision.entity ).toBe( entity );
			expect( entityRevision.revisionId ).toBe( newRevisionId );
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
		} ).reply( StatusCodes.OK, {
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
