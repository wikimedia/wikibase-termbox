import server from './server';
import ServiceRunnerOptions from './ServiceRunnerOptions';

/* eslint-disable no-console */
const options: ServiceRunnerOptions = {
	environment: process.env,
	logger: console,
};
server( options );
