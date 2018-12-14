import HookHandler from '@/client/mediawiki/HookHandler';
import { Hooks } from '@/client/mediawiki/Hooks';

interface MwConfig {
	get( key: string ): any;
}

interface MediaWiki {
	hook: ( key: Hooks ) => HookHandler;
	config: MwConfig;
}

export interface WikibaseContentLanguages {
	getAllPairs: () => any;
}

interface Wikibase {
	WikibaseContentLanguages: {
		new(): WikibaseContentLanguages;
	};
}

export default interface MwWindow extends Window {
	mw: MediaWiki;
	wb: Wikibase;
}
