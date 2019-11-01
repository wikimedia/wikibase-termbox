export type LogLevel =
	'info/service' |
	'error/service' |
	'fatal/service';

interface Logger {
	log( level: LogLevel, info: unknown ): void;
}

export default Logger;
