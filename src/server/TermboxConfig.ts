import dotenv from 'dotenv';
import path from 'path';

interface TermBoxEnv {
	WIKIBASE_REPO_API: string;
	SSR_PORT: string;
}

function loadConfig() {
	const result = dotenv.config( {
		path: path.resolve( '.env' ),
	} );

	if ( !result.parsed ) {
		throw new Error( 'Could not load config from .env' );
	}

	return result.parsed as unknown as TermBoxEnv;
}

export default class TermboxConfig {
	private values: TermBoxEnv;

	public constructor() {
		this.values = loadConfig();
	}

	public getWikibaseRepoApi() {
		return this.values.WIKIBASE_REPO_API;
	}

	public getSsrPort() {
		return this.values.SSR_PORT;
	}
}

const config = new TermboxConfig();

export {
	config,
};
