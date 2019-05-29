import HookHandler from '@/client/mediawiki/HookHandler';
import { Hooks } from '@/client/mediawiki/Hooks';
import { MessageKeys } from '@/common/MessageKeys';

interface MwConfig {
	get( key: string ): any;
}

type MwTitle = new( title: string, namespace: number ) => any;

export interface MwMessage {
	text: () => string;
}

export type MwMessages = ( key: MessageKeys, ...params: string[] ) => MwMessage;

interface MediaWiki {
	hook: ( key: Hooks ) => HookHandler;
	config: MwConfig;
	Title: MwTitle;
	message: MwMessages;
	util: {
		getUrl( title: string, params: object ): string;
	};
	cookie: MWCookie;
}

export interface WikibaseContentLanguages {
	getAllPairs: () => any;
}

export type MWCookieOptions = {
	expires?: Date | number | null;
	prefix?: string;
	domain?: string;
	path?: string;
	secure?: boolean;
}

export interface MWCookie {
	set( name: string, value: string, options?: MWCookieOptions ): void;
	get( name: string ): string;
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
