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

interface Wikibase {
	getLanguageNameByCode( languageCode: string ): string;
}

export default interface MwWindow extends Window {
	mw: MediaWiki;
	wb: Wikibase;
}
