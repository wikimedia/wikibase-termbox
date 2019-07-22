import MwConfig from '@/client/mediawiki/MwConfig';
import HookHandler from '@/client/mediawiki/HookHandler';
import { Hooks } from '@/client/mediawiki/Hooks';
import { MessageKey } from '@/common/MessageKey';

type MwTitle = new( title: string, namespace: number ) => any;

export interface MwMessage {
	text: () => string;
}

export type MwMessages = ( key: MessageKey, ...params: string[] ) => MwMessage;

export interface MWUserOptions {
	get( optionName: string, defaultValue?: any ): any;
}

interface MediaWiki {
	hook: ( key: Hooks ) => HookHandler;
	config: MwConfig;
	Title: MwTitle;
	message: MwMessages;
	util: {
		getUrl( title: string, params: object ): string;
	};
	cookie: MWCookie;
	user: {
		options: MWUserOptions;
	};
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
	set( name: string, value: string|null, options?: MWCookieOptions ): void;
	get( name: string, prefix?: string | null, defaultValue?: string ): string | null;
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
