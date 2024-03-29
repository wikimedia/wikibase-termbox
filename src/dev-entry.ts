import MWConfig from '@/mock-data/MwConfig';
import entity from './mock-data/data/Q64_data.json';
import directionalities from '@/mock-data/data/en_lang_dir_data.json';
import MwWindow from '@/client/mediawiki/MwWindow';
import getOrEnforceUrlParameter from './mock-data/getOrEnforceUrlParameter';
import MockupWikibaseContentLanguages from '@/mock-data/MockWikibaseContentLanguages';
import { message } from './mock-data/MockMwMessages';
import termboxInit from './client-entry';
import EntityInitializer from './common/EntityInitializer';
import FingerprintableEntity from './datamodel/FingerprintableEntity';
import EntityRevisionWithRedirect from './datamodel/EntityRevisionWithRedirect';

const language = getOrEnforceUrlParameter( 'language', 'de' );
const preferredLanguages = getOrEnforceUrlParameter(
	'preferredLanguages',
	'de|en|ar|fr|es',
);

const mwWindow = window as unknown as MwWindow;

mwWindow.mw = {
	config: new MWConfig( language ),
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

termboxInit(
	{
		readingEntityRepository: {
			getFingerprintableEntity( _id: string, _revision: number ): Promise<FingerprintableEntity> {
				return Promise.resolve( new EntityInitializer().newFromSerialization( entity ) );
			},
		},
		writingEntityRepository: {
			saveEntity( entity, baseRevId ): Promise<EntityRevisionWithRedirect> {
				return new Promise( ( resolve ) => {
					setTimeout( // pretend to save for 1s
						() => resolve( new EntityRevisionWithRedirect( entity, baseRevId + 1 ) ),
						1000,
					);
				} );
			},
		},
	},
	true,
	false,
).then( ( app ) => {
	app.mount( '#dev-termbox' );
} );
