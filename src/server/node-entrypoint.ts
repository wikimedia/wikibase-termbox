import server from './server';
import ServiceRunnerOptions from './ServiceRunnerOptions';

const options: ServiceRunnerOptions = {
	config: {
		WIKIBASE_REPO: process.env.WIKIBASE_REPO,
		SSR_PORT: process.env.SSR_PORT,
	},
};
server( options );
