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
			MEDIAWIKI_REQUEST_TIMEOUT: parseInt( envVars.MEDIAWIKI_REQUEST_TIMEOUT ),
			MESSAGES_CACHE_MAX_AGE: parseInt( envVars.MESSAGES_CACHE_MAX_AGE ),
			LANGUAGES_CACHE_MAX_AGE: parseInt( envVars.LANGUAGES_CACHE_MAX_AGE ),
		};
		expect( result ).toEqual( expectedConfig );

		expect( logger.log ).toHaveBeenCalledWith( 'info/service', 'Set config to: ' +
			JSON.stringify( expectedConfig ) );
	} );

	it( 'exits when missing a required variable', () => {
		const logger = getMockLogger();
		const exit = jest.spyOn( process, 'exit' ).mockImplementation();
		const envVars = {
			WIKIBASE_REPO: undefined,
			WIKIBASE_REPO_HOSTNAME_ALIAS: 'default.web.mw.localhost',
			SSR_PORT: '3030',
			MEDIAWIKI_REQUEST_TIMEOUT: '3000',
			MESSAGES_CACHE_MAX_AGE: '60000',
			LANGUAGES_CACHE_MAX_AGE: '300000',
			HEALTHCHECK_QUERY: 'language=de&entity=Q1&revision=3&editLink=/edit/Q1347&preferredLanguages=de|en',
		};

		assertAndGetConfig(
			envVars,
			logger,
		);

		expect( logger.log ).toHaveBeenCalledWith(
			'fatal/service',
			'Failed parsing env vars: EnvVarError: env-var: "WIKIBASE_REPO" is a required variable, but it was not set',
		);
		expect( exit ).toHaveBeenCalled();
	} );

	it( 'returns the defaults for variables that can callback', () => {
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

		const expectedConfig = { ...envVars } as any;
		expectedConfig.MEDIAWIKI_REQUEST_TIMEOUT = DEFAULT_REQUEST_TIMEOUT;
		expectedConfig.MESSAGES_CACHE_MAX_AGE = DEFAULT_MESSAGES_CACHE_MAX_AGE;
		expectedConfig.LANGUAGES_CACHE_MAX_AGE = DEFAULT_LANGUAGES_CACHE_MAX_AGE;
		expectedConfig.HEALTHCHECK_QUERY = '';

		expect( result ).toEqual( expectedConfig );

		expect( logger.log ).toHaveBeenCalledWith( 'info/service', 'Set config to: ' +
			JSON.stringify( expectedConfig ) );
	} );

} );
