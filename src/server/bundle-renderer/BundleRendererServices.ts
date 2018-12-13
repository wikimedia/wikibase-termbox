import mwbot from 'mwbot';

export default class BundleRendererServices {
	public readonly mediawikiBot: mwbot;

	public constructor( mediawikiBot: mwbot ) {
		this.mediawikiBot = mediawikiBot;
	}
}
