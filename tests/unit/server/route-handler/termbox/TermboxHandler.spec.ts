import TermboxHandler from '@/server/route-handler/termbox/TermboxHandler';
import TermboxRequest from '@/common/TermboxRequest';
import InvalidRequest from '@/server/route-handler/termbox/error/InvalidRequest';

function newTermboxHandler( coercer: any, queryValidator: any ) {
	return new TermboxHandler( coercer, queryValidator );
}

describe( 'TermboxHandler', () => {
	describe( 'createTermboxRequest', () => {
		it( 'resolves to TermboxRequest on valid request', () => {
			const validQuery = {
				entity: 'Q64',
				language: 'de',
				editLink: '/edit/Q64',
				preferredLanguages: 'de|en|fr|it|pl|zh',
				revision: 4711,
			};
			const coercer = {
				coerce: ( request: any ) => request,
			};
			const validator = {
				validate: () => undefined,
			};

			const routeHandler = newTermboxHandler( coercer, validator );

			return routeHandler.createTermboxRequest( {
				query: validQuery,
			} ).then( ( termboxRequest: TermboxRequest ) => {
				expect( termboxRequest ).toBeInstanceOf( TermboxRequest );
				expect( termboxRequest.language ).toEqual( validQuery.language );
				expect( termboxRequest.entityId ).toEqual( validQuery.entity );
				expect( termboxRequest.preferredLanguages ).toEqual( validQuery.preferredLanguages );
				expect( termboxRequest.revision ).toEqual( validQuery.revision );

				expect( termboxRequest.links.editLinkUrl ).toEqual( validQuery.editLink );
				expect( termboxRequest.links.loginLinkUrl ).toEqual( '' );
				expect( termboxRequest.links.signUpLinkUrl ).toEqual( '' );
			} );
		} );

		it( 'rejects when failing to validate request', () => {
			const coercer = {
				coerce: ( request: any ) => request,
			};
			const errors = [
				{ path: 'revision', message: 'should have required property "revision"' },
			];
			const validator = {
				validate: () => ( {
					code: 400,
					errors,
				} ),
			};
			const routeHandler = newTermboxHandler( coercer, validator );

			return routeHandler.createTermboxRequest( {
				query: {},
			} ).catch( ( reason: InvalidRequest ) => {
				expect( reason ).toBeInstanceOf( InvalidRequest );
				expect( reason.info ).toBe( errors );
			} );
		} );

	} );
} );
