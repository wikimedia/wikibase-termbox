import HookHandler from '@/client/mediawiki/HookHandler';
import { Hooks } from '@/client/mediawiki/Hooks';

interface MwConfig {
	get( key: string ): any;
}

type MwTitle = new( title: string, namespace: number ) => any;

export interface MwMessage {
	text: () => string;
}

export type MwMessages = ( key: string, ...params: string[] ) => MwMessage;

interface MediaWiki {
	hook: ( key: Hooks ) => HookHandler;
	config: MwConfig;
	Title: MwTitle;
	message: MwMessages;
	util: {
		getUrl( title: string, params: object ): string;
	}
}

export interface WikibaseContentLanguages {
	getAllPairs: () => any;
}

interface Wikibase {
	WikibaseContentLanguages: new() => WikibaseContentLanguages;
	getUserLanguages: () => string[];
}

export interface UlsData {
	getDir: ( languageCode: string ) => string;
}

interface JQUls {
	data: UlsData;
}

interface JQuery {
	uls: JQUls;
}

interface MwWindow extends Window {
	mw: MediaWiki;
	wb: Wikibase;
	$: JQuery;
}

export default MwWindow;
