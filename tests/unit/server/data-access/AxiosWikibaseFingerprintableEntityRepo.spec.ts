import EntityInitializer from '@/common/EntityInitializer';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import AxiosWikibaseFingerprintableEntityRepo from '@/server/data-access/AxiosWikibaseFingerprintableEntityRepo';
import EntityNotFound from '@/common/data-access/error/EntityNotFound';
import TechnicalProblem from '@/common/data-access/error/TechnicalProblem';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MEDIAWIKI_API_SCRIPT } from '@/common/constants';
import HttpStatus from 'http-status-codes';

const axiosMock = new MockAdapter( axios );

function newAxiosWikibaseFingerprintableEntityRepo( initializer?: any ) {
	return new AxiosWikibaseFingerprintableEntityRepo(
		axios,
		initializer || {},
	);
}

describe( 'AxiosWikibaseFingerprintableEntityRepo', () => {

	beforeEach( () => {
		axiosMock.reset();
	} );

	it( 'can be constructed with axios', () => {
		expect( newAxiosWikibaseFingerprintableEntityRepo() )
			.toBeInstanceOf( AxiosWikibaseFingerprintableEntityRepo );
	} );

	describe( 'getFingerprintableEntity', () => {
		it( 'with well-formed wbgetentities query resolves to an Entity on success', ( done ) => {
			const entityId = 'Q3';
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

			axiosMock.onGet( MEDIAWIKI_API_SCRIPT, { params: {
				ids: entityId,
				action: 'wbgetentities',
			} } ).reply( HttpStatus.OK, results );

			const repo = newAxiosWikibaseFingerprintableEntityRepo( new EntityInitializer() );
			repo.getFingerprintableEntity( entityId ).then( ( result: FingerprintableEntity ) => {
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
			axiosMock.onGet().reply( HttpStatus.OK, '<some><random><html>' );

			const repo = newAxiosWikibaseFingerprintableEntityRepo();
			repo.getFingerprintableEntity( entityId ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'wbgetentities result not well formed.' );
				done();
			} );
		} );

		it( 'rejects on result missing entities key', ( done ) => {
			const entityId = 'Q3';
			axiosMock.onGet().reply( HttpStatus.OK, {} );

			const repo = newAxiosWikibaseFingerprintableEntityRepo();
			repo.getFingerprintableEntity( entityId ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'wbgetentities result not well formed.' );
				done();
			} );
		} );

		it( 'rejects on result missing relevant entity in entities', ( done ) => {
			// this maybe is not really a thing as wbgetentities returns the entity with a 'missing' key
			const entityId = 'Q3';
			axiosMock.onGet().reply( HttpStatus.OK, {
				entities: {
					Q4: {
						irrelevant: 'value',
					},
				},
			} );

			const repo = newAxiosWikibaseFingerprintableEntityRepo();
			repo.getFingerprintableEntity( entityId ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( EntityNotFound );
				expect( reason.message ).toEqual( 'wbgetentities result does not contain relevant entity.' );
				done();
			} );
		} );

		it( 'rejects on result indicating relevant entity as missing in entities', ( done ) => {
			const entityId = 'Q3';
			axiosMock.onGet().reply( HttpStatus.OK, {
				entities: {
					Q3: {
						missing: '',
					},
				},
			} );

			const repo = newAxiosWikibaseFingerprintableEntityRepo();
			repo.getFingerprintableEntity( entityId ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( EntityNotFound );
				expect( reason.message ).toEqual( 'Entity flagged missing in response.' );
				done();
			} );
		} );

		it( 'rejects stating the reason in case of API problems', ( done ) => {
			const entityId = 'Q3';
			axiosMock.onGet().reply( HttpStatus.INTERNAL_SERVER_ERROR, 'API problem' );

			const repo = newAxiosWikibaseFingerprintableEntityRepo();
			repo.getFingerprintableEntity( entityId ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'Error: Request failed with status code 500' );
				done();
			} );
		} );

		it( 'rejects stating the technical reason in case of entity initialization problem', ( done ) => {
			const entityId = 'Q3';
			axiosMock.onGet().reply( HttpStatus.OK, {
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
			const repo = newAxiosWikibaseFingerprintableEntityRepo( initializer );
			repo.getFingerprintableEntity( entityId ).catch( ( reason: Error ) => {
				expect( reason ).toBeInstanceOf( TechnicalProblem );
				expect( reason.message ).toEqual( 'initializer sad' );
				done();
			} );
		} );
	} );
} );
