import HookHandler from '@/client/mediawiki/HookHandler';
import { Hooks } from '@/client/mediawiki/Hooks';

interface MwConfig {
	get( key: string ): any;
}

interface MediaWiki {
	hook: ( key: Hooks ) => HookHandler;
	config: MwConfig;
}

interface Wikibase {
	getLanguageNameByCode( languageCode: string ): string;
}

export default interface MwWindow extends Window {
	mw: MediaWiki;
	wb: Wikibase;
}
