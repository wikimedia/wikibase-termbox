interface MwHookHandler {
	add: ( hookCallback: ( args: any ) => void ) => void;
}

interface MwConfig {
	get( key: string ): any;
}

interface MediaWiki {
	hook: ( key: string ) => MwHookHandler;
	config: MwConfig;
}

export default interface MwWindow extends Window {
	mw: MediaWiki;
}
