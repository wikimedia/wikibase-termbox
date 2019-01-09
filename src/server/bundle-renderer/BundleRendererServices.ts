import mwbot from 'mwbot';

interface Logger {
	log( ...things: any[] ): void;
}

export default class BundleRendererServices {
	public readonly mediawikiBot: mwbot;
	public readonly logger: Logger;

	public constructor( mediawikiBot: mwbot, logger: Logger ) {
		this.mediawikiBot = mediawikiBot;
		this.logger = logger;
	}
}
