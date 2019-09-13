import assertAndGetConfig from '@/server/assertAndGetConfig';
import {
	DEFAULT_LANGUAGES_CACHE_MAX_AGE,
	DEFAULT_MESSAGES_CACHE_MAX_AGE,
	DEFAULT_REQUEST_TIMEOUT,
} from '@/common/constants';

function getMockLogger() {
	return {
		log: jest.fn(),
	};
}

describe( 'assertAndGetConfig', () => {

	it( 'returns valid config and logs when all params are valid', () => {
		const logger = getMockLogger();
		const envVars = {
			WIKIBASE_REPO: 'http://default.web.mw.localhost/mediawiki',
			WIKIBASE_REPO_HOSTNAME_ALIAS: 'default.web.mw.localhost',
			SSR_PORT: '3030',
			MEDIAWIKI_REQUEST_TIMEOUT: '3000',
			MESSAGES_CACHE_MAX_AGE: '60000',
			LANGUAGES_CACHE_MAX_AGE: '300000',
			HEALTHCHECK_QUERY: 'language=de&entity=Q1&revision=3&editLink=/edit/Q1347&preferredLanguages=de|en',
		};
		const result = assertAndGetConfig(
			envVars,
			logger,
		);

		const expectedConfig = {
			...envVars,
			SSR_PORT: parseInt( envVars.SSR_PORT ),
			MEDIAWIKI_REQUEST_TIMEOUT: parseInt( envVars.MEDIAWIKI_REQUEST_TIMEOUT ),
			MESSAGES_CACHE_MAX_AGE: parseInt( envVars.MESSAGES_CACHE_MAX_AGE ),
			LANGUAGES_CACHE_MAX_AGE: parseInt( envVars.LANGUAGES_CACHE_MAX_AGE ),
		};
		expect( result ).toEqual( expectedConfig );

		expect( logger.log ).toHaveBeenCalledWith( 'info/service', `Set config to: ${
			JSON.stringify( expectedConfig )}` );
	} );

	it.each( [
		'WIKIBASE_REPO',
		'WIKIBASE_REPO_HOSTNAME_ALIAS',
		'SSR_PORT',
	] )( 'exits when missing a required variable: %s', ( missingVarName ) => {
		const logger = getMockLogger();
		const exit = jest.spyOn( process, 'exit' ).mockImplementation();
		const envVars: any = {
			WIKIBASE_REPO: 'http://default.web.mw.localhost/mediawiki',
			WIKIBASE_REPO_HOSTNAME_ALIAS: 'default.web.mw.localhost',
			SSR_PORT: '3030',
			MEDIAWIKI_REQUEST_TIMEOUT: '4000',
			MESSAGES_CACHE_MAX_AGE: '50000',
			LANGUAGES_CACHE_MAX_AGE: '200000',
			HEALTHCHECK_QUERY: 'language=de&entity=Q1&revision=3&editLink=/edit/Q1347&preferredLanguages=de|en',
		};
		delete envVars[ missingVarName ];

		assertAndGetConfig(
			envVars,
			logger,
		);

		expect( logger.log ).toHaveBeenCalledWith(
			'fatal/service',
			expect.anything(),
		);
		expect( logger.log.mock.calls[ 0 ][ 1 ] )
			.toContain( `Failed parsing env vars: ValidationError: child "${missingVarName}" fails` );
		expect( exit ).toHaveBeenCalled();
	} );

	it( 'falls back to the defaults for omitted optional values', () => {
		const logger = getMockLogger();
		const envVars = {
			WIKIBASE_REPO: 'http://default.web.mw.localhost/mediawiki',
			WIKIBASE_REPO_HOSTNAME_ALIAS: 'default.web.mw.localhost',
			SSR_PORT: '3030',
		};

		const result = assertAndGetConfig(
			envVars,
			logger,
		);

		const expectedConfig = {
			...envVars,

			SSR_PORT: parseInt( envVars.SSR_PORT ),
			MEDIAWIKI_REQUEST_TIMEOUT: DEFAULT_REQUEST_TIMEOUT,
			MESSAGES_CACHE_MAX_AGE: DEFAULT_MESSAGES_CACHE_MAX_AGE,
			LANGUAGES_CACHE_MAX_AGE: DEFAULT_LANGUAGES_CACHE_MAX_AGE,
			HEALTHCHECK_QUERY: '',
		};

		expect( result ).toEqual( expectedConfig );
		expect( logger.log ).toHaveBeenCalledWith(
			'info/service',
			`Set config to: ${JSON.stringify( expectedConfig )}`,
		);
	} );

	// This is important to test because it mimics service-runner behavior.
	it( 'falls back to the defaults given empty strings', () => {
		const logger = getMockLogger();
		const envVars = {
			WIKIBASE_REPO: 'http://default.web.mw.localhost/mediawiki',
			WIKIBASE_REPO_HOSTNAME_ALIAS: 'default.web.mw.localhost',
			SSR_PORT: '3030',
			MEDIAWIKI_REQUEST_TIMEOUT: '',
			MESSAGES_CACHE_MAX_AGE: '',
			LANGUAGES_CACHE_MAX_AGE: '',
		};

		const result = assertAndGetConfig( envVars, logger );

		expect( result.MEDIAWIKI_REQUEST_TIMEOUT ).toBe( DEFAULT_REQUEST_TIMEOUT );
		expect( result.MESSAGES_CACHE_MAX_AGE ).toBe( DEFAULT_MESSAGES_CACHE_MAX_AGE );
		expect( result.LANGUAGES_CACHE_MAX_AGE ).toBe( DEFAULT_LANGUAGES_CACHE_MAX_AGE );
	} );

	it( 'ignores unknown values in the environment', () => {
		const exit = jest.spyOn( process, 'exit' ).mockImplementation();

		assertAndGetConfig( {
			WIKIBASE_REPO: 'http://default.web.mw.localhost/mediawiki',
			WIKIBASE_REPO_HOSTNAME_ALIAS: 'default.web.mw.localhost',
			SSR_PORT: '3030',

			UNKNOWN_ENV_VAR: 'potato',
		}, getMockLogger() );

		expect( exit ).not.toHaveBeenCalled();
	} );

} );
