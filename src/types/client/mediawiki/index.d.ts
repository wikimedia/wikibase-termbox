declare module "mediawiki" {
	export interface ImmediatelyInvokingEntityLoadedHookHandler {
		add: ( hookCallback: ( entity: any ) => void ) => void;
	};
	export interface MW {
		get: ( key: string ) => string;
		hook: ( key: 'wikibase.entityPage.entityLoaded' ) => ImmediatelyInvokingEntityLoadedHookHandler;
	};
	export interface mwWindow extends Window {
		mw: MW;	
	};
}
