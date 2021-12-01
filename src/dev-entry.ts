import MWConfig from '@/mock-data/MwConfig';
import entity from './mock-data/data/Q64_data.json';
import directionalities from '@/mock-data/data/en_lang_dir_data.json';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import MwWindow from '@/client/mediawiki/MwWindow';
import getOrEnforceUrlParameter from './mock-data/getOrEnforceUrlParameter';
import MockupWikibaseContentLanguages from '@/mock-data/MockWikibaseContentLanguages';
import { message } from './mock-data/MockMwMessages';

const language = getOrEnforceUrlParameter( 'language', 'de' );
const preferredLanguages = getOrEnforceUrlParameter(
	'preferredLanguages',
	'de|en|ar|fr|es',
);

const mwWindow = window as unknown as MwWindow;

mwWindow.mw = {
	config: new MWConfig( language ),
	hook: () => new ImmediatelyInvokingEntityLoadedHookHandler( entity ),
	Title: class Title {
		public getUrl(): string { return `/edit/${entity.id}`; }
	},
	message,
	util: {
		getUrl: ( page ) => `#${page}`,
	},
	cookie: {
		set( key: string, value: string|null ) {
			// eslint-disable-next-line no-console
			console.info( `Set ${key} to ${value}.` );
			if ( value === null ) {
				localStorage.removeItem( key );
			} else {
				localStorage.setItem( key, value );
			}
		},
		get( key: string, _prefix?: string | null, defaultValue?: string ) {
			return localStorage.getItem( key ) || defaultValue || null;
		} },
	user: {
		options: {
			get() {
				return null;
			},
		},
	},
};

mwWindow.wb = {
	WikibaseContentLanguages: {
		getTermLanguages: () => new MockupWikibaseContentLanguages(),
	},
	getUserLanguages: () => preferredLanguages.split( '|' ),
};

mwWindow.$ = {
	uls: {
		data: {
			getDir: ( code: string ) => directionalities[ code ],
		},
	},
};
