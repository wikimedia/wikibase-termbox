import EntityInitializer from '@/common/EntityInitializer';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import AxiosSpecialPageEntityRepo from '@/server/data-access/AxiosSpecialPageEntityRepo';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MEDIAWIKI_INDEX_SCRIPT } from '@/common/constants';
import { StatusCodes } from 'http-status-codes';
import EntityInitializerInterface from '@/common/EntityInitializerInterface';
import AxiosTechnicalProblem from '@/common/data-access/error/AxiosTechnicalProblem';

const axiosMock = new MockAdapter( axios );

function newAxiosSpecialPageEntityRepo( initializer?: EntityInitializerInterface ) {
	return new AxiosSpecialPageEntityRepo(
		axios,
		initializer || new EntityInitializer(),
	);
}

const REVISION_MATCHING_ENTITY = 4711;
const REVISION_NOT_MATCHING_ENTITY = 815;

describe( 'AxiosSpecialPageEntityRepo', () => {

	beforeEach( () => {
		axiosMock.reset();
	} );

	it( 'can be constructed with axios', () => {
		expect( newAxiosSpecialPageEntityRepo() )
			.toBeInstanceOf( AxiosSpecialPageEntityRepo );
	} );

	describe( 'getFingerprintableEntity', () => {
		it( 'with well-formed request resolves to an Entity on success', ( done ) => {
			const entityId = 'Q3';
			const revision = REVISION_MATCHING_ENTITY;
			const entity = {
				pageid: 3,
				ns: 120,
				title: 'Item:Q3',
				lastrevid: 1149,
				modified: '2018-07-06T10:41:48Z',
				type: 'item',
				id: 'Q3',
				labels: {
					en: { language: 'en', value: 'potato' },
					de: { language: 'de', value: 'Kartoffel' },
				},
				descriptions: {
					en: { language: 'en', value: 'a root vegetable' },
					de: { language: 'de', value: 'ein Wurzelgemüse' },
				},
				aliases: {
					en: [
						{ language: 'en', value: 'Spud' },
					],
				},
				claims: {},
				sitelinks: {},
			};
			const results = {
				entities: {
					Q3: entity,
				},
			};
			axiosMock.onGet( MEDIAWIKI_INDEX_SCRIPT, { params: {
				title: 'Special:EntityData',
				id: entityId,
				revision,
			} } ).reply( StatusCodes.OK, results );

			const repo = newAxiosSpecialPageEntityRepo();
			repo.getFingerprintableEntity( entityId, revision ).then( ( result: FingerprintableEntity ) => {
				expect( result ).toBeInstanceOf( FingerprintableEntity );
				expect( result.id ).toEqual( entity.id );
				expect( result.labels ).toEqual( entity.labels );
				expect( result.descriptions ).toEqual( entity.descriptions );
				expect( result.aliases ).toEqual( entity.aliases );
				done();
			} );
		} );

		it( 'rejects on result that does not contain an object', ( done ) => {
			const entityId = 'Q3';
			const revision = REVISION_MATCHING_ENTITY;
			axiosMock.onGet().reply( StatusCodes.OK, '<some><random><html>' );

			const repo = newAxiosSpecialPageEntityRepo();
			repo.getFingerprintableEntity( entityId, revision ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'result not well formed.' );
				done();
			} );
		} );

		it( 'rejects on result missing entities key', ( done ) => {
			const entityId = 'Q3';
			const revision = REVISION_MATCHING_ENTITY;
			axiosMock.onGet().reply( StatusCodes.OK, {} );

			const repo = newAxiosSpecialPageEntityRepo();
			repo.getFingerprintableEntity( entityId, revision ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'result not well formed.' );
				done();
			} );
		} );

		it( 'rejects on result missing relevant entity in entities', ( done ) => {
			const entityId = 'Q3';
			const revision = REVISION_MATCHING_ENTITY;
			axiosMock.onGet().reply( StatusCodes.OK, {
				entities: {
					Q4: {
						irrelevant: 'value',
					},
				},
			} );
			const repo = newAxiosSpecialPageEntityRepo();
			repo.getFingerprintableEntity( entityId, revision ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( EntityNotFound );
				expect( reason.message ).toEqual( 'result does not contain relevant entity.' );
				done();
			} );
		} );

		it( 'rejects on result indicating relevant entity as missing', ( done ) => {
			const entityId = 'Q3';
			const revision = REVISION_MATCHING_ENTITY;
			axiosMock.onGet().reply( StatusCodes.NOT_FOUND, 'something something <h1>Not Found</h1> something' );
			const repo = newAxiosSpecialPageEntityRepo();
			repo.getFingerprintableEntity( entityId, revision ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( EntityNotFound );
				expect( reason.message ).toEqual( 'Entity flagged missing in response.' );
				done();
			} );
		} );

		/**
		 * Consider having a dedicated exception for this scenario to return Bad Request
		 * rather than Not Found which is kind of a false statement
		 */
		it( 'rejects on result indicating revision does not belong to entity', ( done ) => {
			const entityId = 'Q3';
			const revision = REVISION_NOT_MATCHING_ENTITY;
			axiosMock.onGet().reply(
				404,
				`<h1>Not Found</h1><p>Can't show revision ${revision} of entity ${entityId}.</p>`,
			);
			const repo = newAxiosSpecialPageEntityRepo();
			repo.getFingerprintableEntity( entityId, revision ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( EntityNotFound );
				expect( reason.message ).toEqual( 'Entity flagged missing in response.' );
				done();
			} );
		} );

		it( 'rejects stating the reason in case of API problems', ( done ) => {
			const entityId = 'Q3';
			const revision = REVISION_MATCHING_ENTITY;
			axiosMock.onGet().reply( StatusCodes.INTERNAL_SERVER_ERROR );
			const repo = newAxiosSpecialPageEntityRepo();
			repo.getFingerprintableEntity( entityId, revision ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( AxiosTechnicalProblem );
				expect( ( reason as AxiosTechnicalProblem ).getContext().message )
					.toEqual( 'Request failed with status code 500' );
				done();
			} );
		} );

		it( 'rejects stating the technical reason in case of entity initialization problem', ( done ) => {
			const entityId = 'Q3';
			const revision = REVISION_MATCHING_ENTITY;
			axiosMock.onGet().reply( StatusCodes.OK, {
				entities: {
					Q3: {
						id: 'Q3',
					},
				},
			} );
			const initializer = {
				newFromSerialization: () => {
					throw new Error( 'initializer sad' );
				},
			};
			const repo = newAxiosSpecialPageEntityRepo( initializer );
			repo.getFingerprintableEntity( entityId, revision ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'initializer sad' );
				done();
			} );
		} );
	} );
} );
