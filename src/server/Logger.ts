export type LogLevel =
	'info/service' |
	'error/service' |
	'fatal/service';

interface Logger {
	log( level: LogLevel, info: any ): void;
}

export default Logger;
