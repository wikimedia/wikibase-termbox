import server from './server';
import ServiceRunnerOptions from './ServiceRunnerOptions';

/* eslint-disable no-console */
const options: ServiceRunnerOptions = {
	config: process.env,
	logger: console,
	metrics: {
		timing(): void {
			console.log( 'metrics: ', JSON.stringify( arguments ) );
		},
		normalizeName: ( name ) => name,
	},
};
server( options );
